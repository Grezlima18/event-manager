const { body, param } = require('express-validator');

const createTicketValidation = [
    body('price_paid')
        .isFloat({ min: 0 }).withMessage('O preço pago deve ser um valor monetário positivo.')
        .notEmpty().withMessage('O preço pago é obrigatório.'),

    body('event_id')
        .isInt({ min: 1 }).withMessage('O ID do evento é obrigatório e deve ser um número inteiro.'),
];

const ticketIdParamValidation = [
    param('id').isInt().withMessage('O ID do ingresso deve ser um número inteiro.')
];

module.exports = {
    createTicketValidation,
    ticketIdParamValidation
};