import { body } from 'express-validator';

export const createStudentValidator = [
    body('name')
        .notEmpty().withMessage('اسم الطالب مطلوب'),
    body('email')
        .isEmail().withMessage('البريد الإلكتروني غير صالح'),
    body('password')
        .isLength({ min: 6 }).withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
];