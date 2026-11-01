import { query } from '../config/db.js';

/**
 * Insert a new verified referral or visit record
 * @param {Object} referralData
 * @param {string} referralData.name
 * @param {string} referralData.mobile
 * @param {number|null} referralData.latitude
 * @param {number|null} referralData.longitude
 * @param {number|null} referralData.accuracy
 * @param {string|null} referralData.location_name
 * @param {string|null} referralData.ip_address
 * @param {string} [referralData.type='referral']
 * @returns {Promise<Object>} Created referral record
 */
export const createReferral = async ({
  name = 'Site Visitor',
  mobile = 'N/A',
  latitude,
  longitude,
  accuracy,
  location_name = null,
  ip_address = null,
  type = 'referral',
}) => {
  const sql = `
    INSERT INTO referrals (name, mobile, latitude, longitude, accuracy, location_name, ip_address, type)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, name, mobile, latitude, longitude, accuracy, location_name, ip_address, type, created_at;
  `;
  const params = [
    name || 'Site Visitor',
    mobile || 'N/A',
    latitude !== undefined && latitude !== null ? latitude : null,
    longitude !== undefined && longitude !== null ? longitude : null,
    accuracy !== undefined && accuracy !== null ? accuracy : null,
    location_name || null,
    ip_address || null,
    type || 'referral',
  ];
  const { rows } = await query(sql, params);
  return rows[0];
};

/**
 * Retrieve all referral submissions ordered by newest first
 * @returns {Promise<Array<Object>>}
 */
export const getAllReferrals = async () => {
  const sql = `
    SELECT id, name, mobile, latitude, longitude, accuracy, location_name, ip_address, type, created_at
    FROM referrals
    ORDER BY created_at DESC;
  `;
  const { rows } = await query(sql);
  return rows;
};

/**
 * Find referral by UUID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export const findReferralById = async (id) => {
  const sql = `
    SELECT id, name, mobile, latitude, longitude, accuracy, location_name, ip_address, type, created_at
    FROM referrals
    WHERE id = $1;
  `;
  const { rows } = await query(sql, [id]);
  return rows[0] || null;
};

