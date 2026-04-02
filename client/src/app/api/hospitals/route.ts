import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { FALLBACK_HOSPITALS } from '@/lib/fallback-data';

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
    console.warn('[Instabed] Database unavailable, serving fallback hospital data.');
    // Return fallback data when DB is not available
    return NextResponse.json(FALLBACK_HOSPITALS);
  }
}
