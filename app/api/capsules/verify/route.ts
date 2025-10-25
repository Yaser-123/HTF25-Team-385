/**
 * Capsule Verification API Route
 * Verifies security question answers for protected capsules
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { capsules } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { decrypt } from '@/lib/encryption';

/**
 * POST - Verify answer to security question
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { capsuleId, answer } = body;

    if (!capsuleId || !answer) {
      return NextResponse.json(
        { error: 'Capsule ID and answer are required' },
        { status: 400 }
      );
    }

    // Fetch the capsule
    const capsule = await db.query.capsules.findFirst({
      where: eq(capsules.id, capsuleId),
    });

    if (!capsule) {
      return NextResponse.json(
        { error: 'Capsule not found' },
        { status: 404 }
      );
    }

    // Check if capsule has a security question
    if (!capsule.question || !capsule.answer) {
      return NextResponse.json(
        { error: 'This capsule does not have a security question' },
        { status: 400 }
      );
    }

    // Decrypt the stored answer and compare (both are lowercase)
    const decryptedAnswer = decrypt(capsule.answer);
    const verified = answer.toLowerCase().trim() === decryptedAnswer.trim();

    return NextResponse.json({
      verified,
    });
  } catch (error) {
    console.error('Error verifying capsule:', error);
    return NextResponse.json(
      { error: 'Failed to verify answer' },
      { status: 500 }
    );
  }
}
