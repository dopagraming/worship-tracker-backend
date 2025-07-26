import { body } from 'express-validator';

export const createWorshipValidator = [
    body('name')
        .notEmpty().withMessage('اسم العبادة مطلوب'),
    body('points')
        .isInt({ min: 0 }).withMessage('النقاط يجب أن تكون عددًا صحيحًا ≥ 0'),
    body('rewardValue')
        .optional()
        .isInt({ min: 0 }).withMessage('قيمة الجائزة يجب أن تكون عددًا صحيحًا ≥ 0'),
];

export const updateWorshipValidator = [
    body('name')
        .optional().notEmpty().withMessage('اسم العبادة لا يمكن أن يكون فارغًا'),
    body('points')
        .optional().isInt({ min: 0 }).withMessage('النقاط يجب أن تكون عددًا صحيحًا ≥ 0'),
    body('rewardValue')
        .optional().isInt({ min: 0 }).withMessage('قيمة الجائزة يجب أن تكون عددًا صحيحًا ≥ 0'),
];