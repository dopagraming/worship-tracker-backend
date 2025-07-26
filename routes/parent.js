import express from 'express';
import {
    createStudent,
    listMyStudents,
    getStudentStats
} from '../controllers/parentController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateResult } from '../middleware/validateResult.js';
import { createStudentValidator } from '../validators/parentValidator.js';

const router = express.Router();

router.use(protect, authorize('parent'));

router.post(
    '/students',
    createStudentValidator,
    validateResult,
    asyncHandler(createStudent)
);

router.get(
    '/students',
    asyncHandler(listMyStudents)
);

router.get(
    '/students/:id',
    asyncHandler(getStudentStats)
);

export default router;
