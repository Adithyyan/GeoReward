import { createReferral, getAllReferrals } from '../models/referralModel.js';

/**
 * Extracts the real client IP address from request headers or socket
 * @param {import('express').Request} req
 * @returns {string}
 */
export const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const firstIp = forwarded.split(',')[0].trim();
    if (firstIp) return firstIp;
  }
  const realIp = req.headers['x-real-ip'];
  if (realIp) return realIp;
  let remote = req.socket?.remoteAddress || req.ip || '127.0.0.1';
  if (typeof remote === 'string' && remote.startsWith('::ffff:')) {
    remote = remote.substring(7);
  }
  return remote;
};

/**
 * Validates a mobile number string (10 to 15 digits)
 * @param {string} mobile
 * @returns {boolean}
 */
const isValidMobile = (mobile) => {
  if (typeof mobile !== 'string') return false;
  const digitsOnly = mobile.replace(/\D/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
};

/**
 * Handle POST /api/referrals/visit
 * Records visitor geolocation and client IP immediately when site loads
 */
export const recordVisit = async (req, res, next) => {
  try {
    const { latitude, longitude, accuracy, client_ip, location_name } = req.body;
    const ip = client_ip || getClientIp(req);

    const parsedLat = parseFloat(latitude);
    const parsedLng = parseFloat(longitude);

    if (
      Number.isNaN(parsedLat) ||
      parsedLat < -90 ||
      parsedLat > 90 ||
      Number.isNaN(parsedLng) ||
      parsedLng < -180 ||
      parsedLng > 180
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates provided.',
      });
    }

    let parsedAccuracy = null;
    if (accuracy !== undefined && accuracy !== null && accuracy !== '') {
      parsedAccuracy = parseFloat(accuracy);
    }

    const visit = await createReferral({
      name: 'Site Visitor',
      mobile: 'N/A',
      latitude: parsedLat,
      longitude: parsedLng,
      accuracy: parsedAccuracy,
      location_name: location_name || null,
      ip_address: ip,
      type: 'visit',
    });

    return res.status(201).json({
      success: true,
      message: 'Visitor location and IP recorded successfully.',
      data: visit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle POST /api/referrals
 * Verifies and records a referral with location coordinates and IP
 */
export const saveReferral = async (req, res, next) => {
  try {
    const { name, mobile, latitude, longitude, accuracy, client_ip, location_name } = req.body;
    const ip = client_ip || getClientIp(req);

    // Validation: Name
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Your name is required and must be at least 2 characters long.",
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Name cannot exceed 100 characters.',
      });
    }

    // Validation: Mobile (10-15 digits)
    if (!mobile || !isValidMobile(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number must contain between 10 and 15 digits.',
      });
    }

    // Validation: Latitude & Longitude
    const parsedLat = parseFloat(latitude);
    const parsedLng = parseFloat(longitude);

    if (
      Number.isNaN(parsedLat) ||
      parsedLat < -90 ||
      parsedLat > 90
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude. Must be a valid coordinate between -90 and 90.',
      });
    }

    if (
      Number.isNaN(parsedLng) ||
      parsedLng < -180 ||
      parsedLng > 180
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid longitude. Must be a valid coordinate between -180 and 180.',
      });
    }

    // Validation: Accuracy
    let parsedAccuracy = null;
    if (accuracy !== undefined && accuracy !== null && accuracy !== '') {
      parsedAccuracy = parseFloat(accuracy);
      if (Number.isNaN(parsedAccuracy) || parsedAccuracy < 0) {
        return res.status(400).json({
          success: false,
          message: 'Accuracy must be a non-negative number.',
        });
      }
    }

    const newReferral = await createReferral({
      name: name.trim(),
      mobile: mobile.trim(),
      latitude: parsedLat,
      longitude: parsedLng,
      accuracy: parsedAccuracy,
      location_name: location_name || null,
      ip_address: ip,
      type: 'referral',
    });

    return res.status(201).json({
      success: true,
      message: 'Bonus will be credited shortly!',
      data: newReferral,
    });
  } catch (error) {
    console.error('saveReferral error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit referral. Please try again.',
    });
  }
};

/**
 * Handle GET /api/referrals
 * Retrieve all referral submissions (Admin protected)
 */
export const getReferrals = async (req, res, next) => {
  try {
    const referrals = await getAllReferrals();
    return res.status(200).json({
      success: true,
      count: referrals ? referrals.length : 0,
      data: referrals || [],
    });
  } catch (error) {
    console.error('getReferrals error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve referrals.',
    });
  }
};

