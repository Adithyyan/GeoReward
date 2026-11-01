import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, query } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabaseAndSeedAdmin() {
  console.log('⚡ Initializing Database and Admin Seeder...');

  try {
    const schemaPath = path.resolve(__dirname, '../../schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Applying database schema (referrals and admins tables)...');
    await pool.query(schemaSql);
    
    // Ensure migrations/columns for ip_address, location_name, and type exist on existing tables
    await pool.query(`
      ALTER TABLE referrals ADD COLUMN IF NOT EXISTS ip_address VARCHAR(100);
      ALTER TABLE referrals ADD COLUMN IF NOT EXISTS location_name VARCHAR(255);
      ALTER TABLE referrals ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'referral';
      DO $$ BEGIN
        ALTER TABLE referrals ALTER COLUMN name DROP NOT NULL;
        ALTER TABLE referrals ALTER COLUMN mobile DROP NOT NULL;
      EXCEPTION
        WHEN OTHERS THEN NULL;
      END $$;
    `);
    console.log('✅ Tables created or verified successfully with ip_address, location_name & type columns.');

    const defaultEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@example.com';
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123';

    const checkSql = 'SELECT id, email FROM admins WHERE LOWER(email) = LOWER($1);';
    const existing = await query(checkSql, [defaultEmail]);

    if (existing.rows.length > 0) {
      console.log(`ℹ️ Admin with email "${defaultEmail}" already exists.`);
    } else {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

      const insertSql = `
        INSERT INTO admins (email, password_hash)
        VALUES (LOWER($1), $2)
        RETURNING id, email, created_at;
      `;
      const result = await query(insertSql, [defaultEmail, hashedPassword]);
      console.log(`✅ Default admin created successfully!`);
      console.log(`   - Email: ${result.rows[0].email}`);
      console.log(`   - Password: ${defaultPassword}`);
      console.log(`   - Admin ID: ${result.rows[0].id}`);
    }

    console.log('🎉 Database initialization complete!');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabaseAndSeedAdmin();
