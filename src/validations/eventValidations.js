const { body, param } = require('express-validator');

const createEventValidation = [
    body('title')
        .notEmpty().withMessage('O título do evento é obrigatório.')
        .isLength({ min: 5, max: 100 }).withMessage('O título deve ter entre 5 e 100 caracteres.'),

    body('date')
        .isISO8601().withMessage('A data deve ser um formato de data/hora válido (ISO 8601).')
        .custom((value) => {
            if (new Date(value) < new Date()) {
                throw new Error('A data do evento deve ser futura.');
            }
            return true;
        }),

    body('price')
        .isFloat({ min: 0 }).withMessage('O preço deve ser um valor monetário positivo.')
        .notEmpty().withMessage('O preço é obrigatório.'),

    body('capacity')
        .isInt({ min: 1 }).withMessage('A capacidade deve ser um número inteiro positivo.'),

    body('location_id')
        .isInt({ min: 1 }).withMessage('O ID do local é obrigatório e deve ser um número inteiro.'),
];

const eventIdParamValidation = [
    param('id').isInt().withMessage('O ID do evento deve ser um número inteiro.')
];

module.exports = {
    createEventValidation,
    eventIdParamValidation
};