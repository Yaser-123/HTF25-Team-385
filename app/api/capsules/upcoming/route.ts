/**
 * Upcoming Capsules API Route
 * Returns the next unlock time for pending capsules
 * Used for auto-refresh functionality
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { capsules } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';

/**
 * GET - Get the next upcoming unlock time
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch the earliest upcoming capsule (not yet unlocked)
    const now = new Date();
    const upcomingCapsules = await db
      .select()
      .from(capsules)
      .where(
        and(
          eq(capsules.userId, userId),
          gt(capsules.unlockDate, now)
        )
      )
      .orderBy(capsules.unlockDate)
      .limit(1);

    if (upcomingCapsules.length > 0) {
      return NextResponse.json({
        nextUnlockTime: upcomingCapsules[0].unlockDate,
        nextCapsule: {
          id: upcomingCapsules[0].id,
          unlockDate: upcomingCapsules[0].unlockDate,
          createdAt: upcomingCapsules[0].createdAt,
        },
      });
    }

    return NextResponse.json({
      nextUnlockTime: null,
      nextCapsule: null,
    });
  } catch (error) {
    console.error('Error fetching upcoming capsules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming capsules' },
      { status: 500 }
    );
  }
}
