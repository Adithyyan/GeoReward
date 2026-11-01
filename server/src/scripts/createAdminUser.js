import bcrypt from 'bcryptjs';
import { pool, query } from '../config/db.js';

async function createOrUpdateAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';

  console.log(`Setting up Admin account for: ${email}`);

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const upsertSql = `
      INSERT INTO admins (email, password_hash)
      VALUES (LOWER($1), $2)
      ON CONFLICT (email) 
      DO UPDATE SET password_hash = EXCLUDED.password_hash
      RETURNING id, email, created_at;
    `;

    const result = await query(upsertSql, [email, passwordHash]);
    const admin = result.rows[0];

    console.log('✅ Admin account configured successfully:');
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Admin ID: ${admin.id}`);
  } catch (error) {
    console.error('❌ Error creating/updating admin:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createOrUpdateAdmin();

