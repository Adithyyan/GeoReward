import jwt from 'jsonwebtoken';

/**
 * Middleware to verify JWT authentication token
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authorization header missing.',
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Malformed authorization header. Format must be "Bearer <token>".',
    });
  }

  const token = parts[1];
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    console.error('JWT_ACCESS_SECRET is not configured.');
    return res.status(500).json({
      success: false,
      message: 'Server error: JWT secret not set.',
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Authentication token has expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or corrupted token.',
    });
  }
};
