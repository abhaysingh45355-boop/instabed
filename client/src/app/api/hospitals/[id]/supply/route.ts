import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { getFallbackHospitalById } from '@/lib/fallback-data';

// Helper to transform a hospital (DB or fallback) into the dashboard supply shape
function toSupplyShape(hospital: any) {
  return {
    beds: {
      general: {
        total: hospital.beds?.total_general ?? 0,
        available: hospital.beds?.available_general ?? 0,
      },
      icu: {
        total: hospital.beds?.total_icu ?? 0,
        available: hospital.beds?.available_icu ?? 0,
      },
      ventilator: {
        total: hospital.beds?.total_ventilator ?? 0,
        available: hospital.beds?.available_ventilator ?? 0,
      },
    },
    oxygen: {
      cylinders: hospital.oxygen?.total_cylinders ?? 0,
      available: hospital.oxygen?.cylinders_available ?? 0,
      litersPerMin: hospital.oxygen?.flow_rate_lpm ?? 0,
    },
    blood: Array.isArray(hospital.blood)
      ? hospital.blood.reduce(
          (acc: Record<string, number>, b: any) => {
            acc[b.blood_group] = b.units_available;
            return acc;
          },
          {} as Record<string, number>
        )
      : {},
    lastUpdated:
      hospital.beds?.last_updated?.toISOString?.() ||
      hospital.beds?.last_updated ||
      hospital.updated_at?.toISOString?.() ||
      hospital.updated_at ||
      new Date().toISOString(),
  };
}

// GET — Fetch all supply data for a hospital (dashboard load)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const hospital = await prisma.hospital.findUnique({
      where: { id },
      include: { beds: true, oxygen: true, blood: true },
    });

    if (!hospital) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }

    return NextResponse.json(toSupplyShape(hospital));
  } catch (error: unknown) {
    console.warn('[Instabed] Database unavailable for supply GET, trying fallback.');
    // Fallback: try to find hospital in mock data
    const fallback = getFallbackHospitalById(id);
    if (fallback) {
      return NextResponse.json(toSupplyShape(fallback));
    }
    return NextResponse.json(
      { error: 'Failed to fetch supply data' },
      { status: 500 }
    );
  }
}

// PUT — Update all supply data for a hospital (dashboard save)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(authHeader.split(' ')[1]);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired authentication token' },
        { status: 401 }
      );
    }

    // Verify authorization — user must be admin of this hospital or super admin
    if (decoded.hospitalId !== id && decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'You are not authorized to update this hospital' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { beds, oxygen, blood } = body;

    // Server-side validation
    if (beds) {
      for (const type of ['general', 'icu', 'ventilator'] as const) {
        if (beds[type]) {
          if (beds[type].available > beds[type].total) {
            return NextResponse.json(
              { error: `Available ${type} beds cannot exceed total capacity` },
              { status: 400 }
            );
          }
          if (beds[type].total < 0 || beds[type].available < 0) {
            return NextResponse.json(
              { error: 'Bed counts cannot be negative' },
              { status: 400 }
            );
          }
        }
      }
    }

    // Atomic transaction — all updates succeed or none do
    await prisma.$transaction(async (tx) => {
      // Update bed availability
      if (beds) {
        await tx.bedAvailability.upsert({
          where: { hospital_id: id },
          create: {
            hospital_id: id,
            total_general: beds.general?.total ?? 0,
            available_general: beds.general?.available ?? 0,
            total_icu: beds.icu?.total ?? 0,
            available_icu: beds.icu?.available ?? 0,
            total_ventilator: beds.ventilator?.total ?? 0,
            available_ventilator: beds.ventilator?.available ?? 0,
            updated_by: decoded.userId,
            last_updated: new Date(),
          },
          update: {
            total_general: beds.general?.total ?? 0,
            available_general: beds.general?.available ?? 0,
            total_icu: beds.icu?.total ?? 0,
            available_icu: beds.icu?.available ?? 0,
            total_ventilator: beds.ventilator?.total ?? 0,
            available_ventilator: beds.ventilator?.available ?? 0,
            updated_by: decoded.userId,
            last_updated: new Date(),
          },
        });
      }

      // Update oxygen inventory
      if (oxygen) {
        await tx.oxygenInventory.upsert({
          where: { hospital_id: id },
          create: {
            hospital_id: id,
            total_cylinders: oxygen.cylinders ?? 0,
            cylinders_available: oxygen.available ?? 0,
            flow_rate_lpm: oxygen.litersPerMin ?? 0,
            updated_by: decoded.userId,
            last_updated: new Date(),
          },
          update: {
            total_cylinders: oxygen.cylinders ?? 0,
            cylinders_available: oxygen.available ?? 0,
            flow_rate_lpm: oxygen.litersPerMin ?? 0,
            updated_by: decoded.userId,
            last_updated: new Date(),
          },
        });
      }

      // Update blood inventory
      if (blood && typeof blood === 'object') {
        for (const [group, units] of Object.entries(blood)) {
          await tx.bloodInventory.upsert({
            where: {
              hospital_id_blood_group: { hospital_id: id, blood_group: group },
            },
            create: {
              hospital_id: id,
              blood_group: group,
              units_available: units as number,
              updated_by: decoded.userId,
              last_updated: new Date(),
            },
            update: {
              units_available: units as number,
              updated_by: decoded.userId,
              last_updated: new Date(),
            },
          });
        }
      }

      // Audit log
      await tx.auditLog.create({
        data: {
          user_id: decoded.userId,
          action: 'UPDATE_SUPPLY',
          entity: 'Hospital',
          entity_id: id,
          details: { beds, oxygen, blood },
        },
      });
    });

    return NextResponse.json({ message: 'Supply data updated successfully' });
  } catch (error: unknown) {
    console.error('Update supply error:', error);
    return NextResponse.json(
      { error: 'Failed to update supply data. Please try again.' },
      { status: 500 }
    );
  }
}
