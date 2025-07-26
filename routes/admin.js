import express from 'express';
import {
    createWorship,
    listWorships,
    updateWorship,
    deleteWorship,
    manageUsers,
    getStatsForUser
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateResult } from '../middleware/validateResult.js';
import {
    createWorshipValidator,
    updateWorshipValidator
} from '../validators/worshipValidator.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.post(
    '/worships',
    createWorshipValidator,
    validateResult,
    asyncHandler(createWorship)
);

router.get(
    '/worships',
    asyncHandler(listWorships)
);

router.put(
    '/worships/:id',
    updateWorshipValidator,
    validateResult,
    asyncHandler(updateWorship)
);

router.delete(
    '/worships/:id',
    asyncHandler(deleteWorship)
);

router.get(
    '/users',
    asyncHandler(manageUsers)
);

router.get(
    '/users/:id/stats',
    asyncHandler(getStatsForUser)
);

export default router;
