import express from 'express';
import {
    createWorship,
    listWorships,
    updateWorship,
    deleteWorship,
    manageUsers,
    getStatsForUser,
    createParent,
    createStudent,
    listStudentsByParent,
    updateStudent,
    deleteStudent,
    deleteGift,
    updateGift,
    createGift,
    listGifts
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateResult } from '../middleware/validateResult.js';
import {
    createWorshipValidator,
    updateWorshipValidator
} from '../validators/worshipValidator.js';
import { body } from 'express-validator';

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

router.post(
    '/users',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password min length is 6')
    ],
    validateResult,
    asyncHandler(createParent)
);

router.get(
    '/users/:id/stats',
    asyncHandler(getStatsForUser)
);

router.get(
    '/parents/:parentId/students',
    asyncHandler(listStudentsByParent)
);
router.post(
    '/parents/:parentId/students',
    validateResult,
    asyncHandler(createStudent)
);
router.put(
    '/students/:studentId',
    [ /* update validators */],
    validateResult,
    asyncHandler(updateStudent)
);
router.delete(
    '/students/:studentId',
    asyncHandler(deleteStudent)
);

router.get('/gifts', asyncHandler(listGifts));
router.post(
    '/gifts',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('cost').isInt({ min: 0 }).withMessage('Cost must be a non-negative integer')
    ],
    validateResult,
    asyncHandler(createGift)
);
router.put(
    '/gifts/:id',
    [
        body('name').optional().notEmpty(),
        body('cost').optional().isInt({ min: 0 })
    ],
    validateResult,
    asyncHandler(updateGift)
);
router.delete('/gifts/:id', asyncHandler(deleteGift));

export default router;
