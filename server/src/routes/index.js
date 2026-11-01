import { Router } from 'express';
import referralRoutes from './referralRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Refer & Win Location Verification API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount sub-routes
router.use('/referrals', referralRoutes);
router.use('/admin', adminRoutes);

export default router;
