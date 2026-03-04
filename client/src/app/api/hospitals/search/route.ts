import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const city = url.searchParams.get('city');
    const bloodGroup = url.searchParams.get('bloodGroup');
    const minBeds = url.searchParams.get('minBeds');

    const hospitals = await prisma.hospital.findMany({
      where: {
        city: city ? city : undefined,
        beds: minBeds
          ? {
              available_general: { gte: parseInt(minBeds, 10) }
            }
          : undefined,
        blood: bloodGroup
          ? {
              some: {
                blood_group: bloodGroup,
                units_available: { gt: 0 }
              }
            }
          : undefined
      },
      include: {
        beds: true,
        blood: true
      }
    });

    return NextResponse.json(hospitals);
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
