const { body, param } = require('express-validator');

const createLocationValidation = [
    body('name')
        .notEmpty().withMessage('O nome do local é obrigatório.')
        .isLength({ min: 5, max: 100 }).withMessage('O nome deve ter entre 5 e 100 caracteres.'),

    body('address')
        .notEmpty().withMessage('O endereço é obrigatório.'),

    body('capacity')
        .isInt({ min: 10 }).withMessage('A capacidade deve ser um número inteiro, mínimo 10.'),
];

const locationIdParamValidation = [
    param('id').isInt().withMessage('O ID do local deve ser um número inteiro.')
];

module.exports = {
    createLocationValidation,
    locationIdParamValidation
};