import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signToken } from '@/lib/auth';
import { getFallbackUserByEmail, getFallbackPasswordHash } from '@/lib/fallback-data';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Try database first
    let user: any = null;
    let usingFallback = false;

    try {
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        include: { hospital: true },
      });
    } catch (dbError) {
      console.warn('[Instabed] Database unavailable, using fallback auth.');
      usingFallback = true;
    }

    // If DB failed, try fallback data
    if (usingFallback) {
      const fallbackUser = getFallbackUserByEmail(email);
      if (!fallbackUser) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Verify password against "hospital123"
      const isValid = await bcrypt.compare(password, await getFallbackPasswordHash());
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      const token = signToken({
        userId: fallbackUser.id,
        email: fallbackUser.email,
        hospitalId: fallbackUser.hospital_id,
        role: fallbackUser.role,
      });

      return NextResponse.json({
        token,
        user: {
          id: fallbackUser.id,
          name: fallbackUser.full_name,
          email: fallbackUser.email,
          role: fallbackUser.role,
          hospitalId: fallbackUser.hospital_id,
          hospitalName: fallbackUser.hospital?.name || null,
        },
      });
    }

    // Normal DB flow
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Your account is inactive. Please contact the administrator.' },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { last_login: new Date() },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      hospitalId: user.hospital_id,
      role: user.role,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role,
        hospitalId: user.hospital_id,
        hospitalName: user.hospital?.name || null,
      },
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed. Please try again.' },
      { status: 500 }
    );
  }
}
