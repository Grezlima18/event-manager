class CustomError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.status = status;
    this.details = details;
    this.isOperational = true;
  }
}

const errorHandler = (err, req, res, next) => {
  let statusCode = err.status || 500;
  let message = err.message || 'Ocorreu um erro interno no servidor.';
  let details = err.details || null;

  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'Um registro com este valor já existe.';
    details = err.errors.map(e => ({ field: e.path, message: e.message }));
  }

  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Erro de validação dos dados.';
    details = err.errors.map(e => ({ field: e.path, message: e.message }));
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Erro de referência: registro relacionado não existe.';
  }

  if (statusCode === 500 && !err.isOperational) {
    console.error('❌ ERRO CRÍTICO NÃO ESPERADO:', err.stack);
    message = 'Ocorreu um erro inesperado no servidor.';
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(details && { details: details })
  });
};

module.exports = { errorHandler, CustomError };