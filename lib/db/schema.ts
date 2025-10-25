/**
 * Database Schema for Celestia Time Capsule App
 * Defines the capsules table structure
 */

import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Capsules Table
 * Stores encrypted time capsule data with unlock dates
 */
export const capsules = pgTable('capsules', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(), // Clerk user ID
  content: text('content').notNull(), // Encrypted content (text/image/video as base64)
  unlockDate: timestamp('unlock_date', { withTimezone: true }).notNull(),
  question: text('question'), // Optional security question
  answer: text('answer'), // Encrypted answer (stored in lowercase)
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Capsule = typeof capsules.$inferSelect;
export type NewCapsule = typeof capsules.$inferInsert;
