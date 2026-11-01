import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findAdminByEmail, findAdminById } from '../models/adminModel.js';

/**
 * Handle POST /api/admin/login
 * Verifies email/password and returns JWT access token
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const admin = await findAdminByEmail(trimmedEmail);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      console.error('JWT_ACCESS_SECRET missing from environment.');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: JWT secret missing.',
      });
    }

    const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: 'admin',
      },
      secret,
      { expiresIn }
    );

    return res.status(200).json({
      success: true,
      message: 'Admin authentication successful.',
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        createdAt: admin.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle GET /api/admin/me
 * Retrieves current admin details (Protected)
 */
export const getAdminProfile = async (req, res, next) => {
  try {
    const admin = await findAdminById(req.user.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found.',
      });
    }

    return res.status(200).json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        createdAt: admin.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};
