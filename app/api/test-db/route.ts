/**
 * Test Database Connection API
 * Use this to verify Neon DB is connected and working
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { capsules } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    // Try to query the database
    const result = await db.select().from(capsules).limit(1);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      tableExists: true,
      sampleCount: result.length,
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: 'Failed to connect to Neon database',
      },
      { status: 500 }
    );
  }
}
