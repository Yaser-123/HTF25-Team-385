/**
 * Capsules API Route
 * Handles CRUD operations for time capsules
 * POST: Create a new capsule
 * GET: Fetch unlocked capsules
 * PUT: Update a capsule
 * DELETE: Delete a capsule
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { capsules } from '@/lib/db/schema';
import { encrypt, decrypt } from '@/lib/encryption';
import { eq, and, lte } from 'drizzle-orm';

/**
 * GET - Fetch all unlocked capsules for the current user
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

    // Fetch capsules that are unlocked (unlockDate <= now)
    const now = new Date();
    const userCapsules = await db
      .select()
      .from(capsules)
      .where(
        and(
          eq(capsules.userId, userId),
          lte(capsules.unlockDate, now)
        )
      )
      .orderBy(capsules.createdAt);

    // Decrypt content for each capsule
    const decryptedCapsules = userCapsules.map((capsule) => ({
      ...capsule,
      content: decrypt(capsule.content),
    }));

    return NextResponse.json({
      capsules: decryptedCapsules,
      count: decryptedCapsules.length,
    });
  } catch (error) {
    console.error('Error fetching capsules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch capsules' },
      { status: 500 }
    );
  }
}

/**
 * POST - Create a new time capsule
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { content, unlockDate, question, answer } = body;

    // Validate input
    if (!content || !unlockDate) {
      return NextResponse.json(
        { error: 'Content and unlock date are required' },
        { status: 400 }
      );
    }

    // Validate unlock date is in the future (at least 1 minute)
    const unlock = new Date(unlockDate);
    const now = new Date();
    const oneMinuteFromNow = new Date(now.getTime() + 60000);
    
    if (unlock <= oneMinuteFromNow) {
      return NextResponse.json(
        { error: 'Unlock date must be at least 1 minute in the future' },
        { status: 400 }
      );
    }

    // Validate question/answer pair
    if ((question && !answer) || (!question && answer)) {
      return NextResponse.json(
        { error: 'Both question and answer must be provided together' },
        { status: 400 }
      );
    }

    // Encrypt content before storing
    const encryptedContent = encrypt(content);
    
    // Encrypt answer if provided (already lowercase from client)
    const encryptedAnswer = answer ? encrypt(answer) : null;

    // Insert into database
    const [newCapsule] = await db
      .insert(capsules)
      .values({
        userId,
        content: encryptedContent,
        unlockDate: unlock,
        question: question || null,
        answer: encryptedAnswer,
      })
      .returning();

    return NextResponse.json(
      {
        message: 'Capsule created successfully',
        capsule: {
          ...newCapsule,
          content: decrypt(newCapsule.content), // Return decrypted for confirmation
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating capsule:', error);
    return NextResponse.json(
      { error: 'Failed to create capsule' },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update an existing capsule
 */
export async function PUT(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { id, content, unlockDate } = body;

    // Validate input
    if (!id) {
      return NextResponse.json(
        { error: 'Capsule ID is required' },
        { status: 400 }
      );
    }

    // Check if capsule exists and belongs to user
    const [existingCapsule] = await db
      .select()
      .from(capsules)
      .where(
        and(
          eq(capsules.id, id),
          eq(capsules.userId, userId)
        )
      )
      .limit(1);

    if (!existingCapsule) {
      return NextResponse.json(
        { error: 'Capsule not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    
    if (content) {
      updateData.content = encrypt(content);
    }
    
    if (unlockDate) {
      const unlock = new Date(unlockDate);
      const now = new Date();
      const oneMinuteFromNow = new Date(now.getTime() + 60000);
      
      if (unlock <= oneMinuteFromNow) {
        return NextResponse.json(
          { error: 'Unlock date must be at least 1 minute in the future' },
          { status: 400 }
        );
      }
      updateData.unlockDate = unlock;
    }

    // Update capsule
    const [updatedCapsule] = await db
      .update(capsules)
      .set(updateData)
      .where(eq(capsules.id, id))
      .returning();

    return NextResponse.json({
      message: 'Capsule updated successfully',
      capsule: {
        ...updatedCapsule,
        content: decrypt(updatedCapsule.content),
      },
    });
  } catch (error) {
    console.error('Error updating capsule:', error);
    return NextResponse.json(
      { error: 'Failed to update capsule' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete a capsule
 */
export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get capsule ID from query params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Capsule ID is required' },
        { status: 400 }
      );
    }

    // Delete capsule (only if it belongs to the user)
    const [deletedCapsule] = await db
      .delete(capsules)
      .where(
        and(
          eq(capsules.id, id),
          eq(capsules.userId, userId)
        )
      )
      .returning();

    if (!deletedCapsule) {
      return NextResponse.json(
        { error: 'Capsule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Capsule deleted successfully',
      id: deletedCapsule.id,
    });
  } catch (error) {
    console.error('Error deleting capsule:', error);
    return NextResponse.json(
      { error: 'Failed to delete capsule' },
      { status: 500 }
    );
  }
}
