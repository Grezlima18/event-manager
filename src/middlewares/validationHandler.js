const { validationResult } = require('express-validator');
const { CustomError } = require('./errorHandler');

const validationHandler = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorDetails = errors.array().map(error => ({
            field: error.path,
            message: error.msg,
            value: error.value,
        }));

        const validationError = new CustomError('Erro de validação dos dados fornecidos.', 400);
        validationError.details = errorDetails;

        return next(validationError);
    }

    next();
};

module.exports = validationHandler;