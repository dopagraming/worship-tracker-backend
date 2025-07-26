import { body } from 'express-validator';

export const registerValidator = [
    body('name')
        .notEmpty().withMessage('الاسم مطلوب'),
    body('email')
        .isEmail().withMessage('البريد الإلكتروني غير صالح'),
    body('password')
        .isLength({ min: 6 }).withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
    body('role')
        .isIn(['admin', 'parent', 'student']).withMessage('الدور غير صالح'),
    body('parentRef')
        .optional().isMongoId().withMessage('معرّف ولي الأمر غير صالح')
];

export const loginValidator = [
    body('email')
        .isEmail().withMessage('البريد الإلكتروني غير صالح'),
    body('password')
        .notEmpty().withMessage('كلمة المرور مطلوبة')
];