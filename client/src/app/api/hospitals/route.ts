import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const hospitals = await prisma.hospital.findMany({
      include: {
        beds: true,
        oxygen: true,
        blood: true
      }
    });
    return NextResponse.json(hospitals);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hospitals' }, { status: 500 });
  }
}
