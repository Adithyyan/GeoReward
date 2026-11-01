import { query } from '../config/db.js';

/**
 * Find admin by email
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
export const findAdminByEmail = async (email) => {
  const sql = `
    SELECT id, email, password_hash, created_at
    FROM admins
    WHERE LOWER(email) = LOWER($1);
  `;
  const { rows } = await query(sql, [email.trim()]);
  return rows[0] || null;
};

/**
 * Find admin by UUID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export const findAdminById = async (id) => {
  const sql = `
    SELECT id, email, created_at
    FROM admins
    WHERE id = $1;
  `;
  const { rows } = await query(sql, [id]);
  return rows[0] || null;
};

/**
 * Create a new admin account
 * @param {Object} adminData
 * @param {string} adminData.email
 * @param {string} adminData.passwordHash
 * @returns {Promise<Object>} Created admin (without password_hash)
 */
export const createAdmin = async ({ email, passwordHash }) => {
  const sql = `
    INSERT INTO admins (email, password_hash)
    VALUES (LOWER($1), $2)
    RETURNING id, email, created_at;
  `;
  const { rows } = await query(sql, [email.trim(), passwordHash]);
  return rows[0];
};
