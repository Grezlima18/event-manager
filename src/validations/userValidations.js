const { body } = require('express-validator');

const registerValidation = [
    body('name')
        .notEmpty().withMessage('O nome é obrigatório.')
        .isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres.'),

    body('email')
        .isEmail().withMessage('O email deve ser um endereço de email válido.')
        .notEmpty().withMessage('O email é obrigatório.'),

    body('password')
        .isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.')
        .notEmpty().withMessage('A senha é obrigatória.'),
];

const loginValidation = [
    body('email')
        .isEmail().withMessage('O email deve ser um endereço de email válido.')
        .notEmpty().withMessage('O email é obrigatório.'),

    body('password')
        .notEmpty().withMessage('A senha é obrigatória.')
];

const updateProfileValidation = [
    body('name')
        .notEmpty().withMessage('O nome é obrigatório.')
        .isLength({ min: 3 }).withMessage('O nome deve ter pelo menos 3 caracteres.'),

    body('email')
        .isEmail().withMessage('O email deve ser um endereço de email válido.')
        .notEmpty().withMessage('O email é obrigatório.'),
];

module.exports = {
    registerValidation,
    loginValidation,
    updateProfileValidation
};