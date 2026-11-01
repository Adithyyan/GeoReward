import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Load .env.local if available, otherwise fallback to .env (local dev only)
if (typeof import.meta.url === 'string' && import.meta.url.startsWith('file:') && !process.env.CLOUDFLARE_WORKER && !process.env.VERCEL) {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const envLocalPath = path.resolve(__dirname, '../../.env.local');
    const envPath = path.resolve(__dirname, '../../.env');

    if (fs.existsSync(envLocalPath)) {
      dotenv.config({ path: envLocalPath });
    } else if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
    }
  } catch (e) {
    // Platform provides process.env directly
  }
}

const { Pool } = pg;

let poolInstance = null;

export const getPool = () => {
  if (!poolInstance) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is missing in Cloudflare Worker settings. Please add it under Settings -> Variables and Secrets.');
    }
    const isNeonOrProduction = 
      process.env.DATABASE_URL.includes('neon.tech') || 
      process.env.NODE_ENV === 'production' ||
      process.env.DATABASE_URL.includes('sslmode=require');

    poolInstance = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isNeonOrProduction ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 20000, // 20s allows Neon serverless compute to wake up from cold start
    });

    poolInstance.on('error', (err) => {
      console.error('Unexpected database pool error on idle client:', err);
    });
  }
  return poolInstance;
};

export const pool = {
  query: (...args) => getPool().query(...args),
  on: (...args) => getPool().on(...args),
};

/**
 * Execute a parameterized SQL query with automatic retry for serverless wake-up
 * @param {string} text - SQL statement
 * @param {Array} params - Query parameters
 * @param {number} [retries=2] - Number of retry attempts on cold-start disconnect
 * @returns {Promise<pg.QueryResult>}
 */
export const query = async (text, params, retries = 2) => {
  const start = Date.now();
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      if (process.env.NODE_ENV === 'development') {
        console.log(`[SQL Query] Executed in ${duration}ms | Rows: ${res.rowCount}`);
      }
      return res;
    } catch (error) {
      const isConnectionIssue =
        error.message?.includes('timeout') ||
        error.message?.includes('terminated') ||
        error.code === 'ECONNRESET' ||
        error.code === '57P01';

      if (isConnectionIssue && attempt < retries) {
        console.warn(`[SQL Retry] Re-attempting query after serverless wake-up (Attempt ${attempt}/${retries})...`);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        continue;
      }

      console.error('[SQL Error]:', error.message, '\nQuery:', text);
      throw error;
    }
  }
};

export default {
  pool,
  query,
};
