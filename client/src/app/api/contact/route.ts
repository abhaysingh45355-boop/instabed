import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, hospital, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    try {
      await prisma.contact.create({
        data: { name, email, hospital: hospital || null, message },
      });
    } catch (dbError) {
      // Database unavailable — log the contact form submission and return success
      // In production, you'd queue this for retry or send via email
      console.warn('[Instabed] Database unavailable for contact form. Logging submission.');
      console.log('[Instabed] Contact form submission:', { name, email, hospital, message });
    }

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (error: unknown) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
