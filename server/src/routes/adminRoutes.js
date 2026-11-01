import { Router } from 'express';
import { login, getAdminProfile } from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Public route: Admin login
router.post('/login', login);

// Protected route: Current admin profile
router.get('/me', authenticateToken, getAdminProfile);

export default router;
