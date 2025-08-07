import express from 'express';
import { listDailyWorships, completeWorship, redeemGift } from '../controllers/studentController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateResult } from '../middleware/validateResult.js';
import { completeWorshipValidator } from '../validators/studentValidator.js';
import User from '../models/User.js';
import Gift from '../models/Gift.js';

const router = express.Router();

router.use(protect, authorize('student'));

router.get(
    '/daily',
    asyncHandler(listDailyWorships)
);

router.post(
    '/daily',
    completeWorshipValidator,
    validateResult,
    asyncHandler(completeWorship)
);

router.post(
    '/redeem/:giftId',
    asyncHandler(redeemGift)
);

export default router;
