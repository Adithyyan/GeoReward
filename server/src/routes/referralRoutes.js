import { Router } from 'express';
import { saveReferral, recordVisit, getReferrals } from '../controllers/referralController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Public route: Automatically record visitor location & IP on site load
router.post('/visit', recordVisit);

// Public route: Verify location and record referral claim
router.post('/', saveReferral);

// Protected route: List all referrals for admin
router.get('/', authenticateToken, getReferrals);

export default router;

