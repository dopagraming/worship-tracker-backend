import express from 'express';
import { listDailyWorships, completeWorship } from '../controllers/studentController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateResult } from '../middleware/validateResult.js';
import { completeWorshipValidator } from '../validators/studentValidator.js';

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

export default router;
