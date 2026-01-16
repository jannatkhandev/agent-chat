import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    const { name, email, facePhoto } = await req.json();

    // Validate required fields
    if (!name || !email || !facePhoto) {
      return NextResponse.json(
        { error: 'Name, email, and face photo are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Generate unique ID
    const id = nanoid();

    // Save to Redis
    const data = {
      name,
      email,
      facePhoto, // Base64 encoded image
      timestamp: Date.now(),
    };

    await redis.set(id, JSON.stringify(data));

    return NextResponse.json({
      success: true,
      id,
      message: 'Form submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}
