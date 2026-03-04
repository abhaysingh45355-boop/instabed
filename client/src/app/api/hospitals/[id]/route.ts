import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const hospital = await prisma.hospital.findUnique({
      where: { id },
      include: {
        beds: true,
        oxygen: true,
        blood: true
      }
    });

    if (!hospital) return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    return NextResponse.json(hospital);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hospital' }, { status: 500 });
  }
}
