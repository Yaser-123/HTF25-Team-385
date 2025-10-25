/**
 * Database Connection
 * Sets up the Neon PostgreSQL connection with Drizzle ORM
 */

import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema';

// Create a connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

// Initialize Drizzle ORM
export const db = drizzle(pool, { schema });
