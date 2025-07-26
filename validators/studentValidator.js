import { body } from 'express-validator';

export const completeWorshipValidator = [
    body('worshipId')
        .notEmpty().withMessage('معرّف العبادة مطلوب')
        .isMongoId().withMessage('معرّف العبادة غير صالح'),
];