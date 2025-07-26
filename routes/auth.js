import express from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/authController.js';
import { registerValidator, loginValidator } from '../validators/authValidator.js';
import { validateResult } from '../middleware/validateResult.js';
import { body } from 'express-validator';
const router = express.Router();

router.post(
    '/register',
    registerValidator,
    validateResult,
    register
);

router.post(
    '/login',
    loginValidator,
    validateResult,
    login
);

router.post(
    '/forgot-password',
    body('email').isEmail().withMessage('Valid email required'),
    validateResult,
    forgotPassword
);

router.post(
    '/reset-password/:token',
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
    validateResult,
    resetPassword
);

export default router;
