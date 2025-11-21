const { errorHandler, CustomError } = require('../errorHandler'); // Assumindo que CustomError está no mesmo arquivo
const { Sequelize } = require('sequelize'); 

describe('errorHandler Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    // Teste 1: CustomError
    it('deve retornar CustomError com status e mensagem corretos', () => {
        // Arrange
        const err = new CustomError('Recurso não encontrado.', 404);

        // Act
        errorHandler(err, req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Recurso não encontrado.'
        }));
    });

    // Teste 2: Erro 500 genérico
    it('deve retornar 500 para um erro genérico não capturado', () => {
        // Arrange
        const err = new Error('Erro de BD interno');

        // Act
        errorHandler(err, req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Ocorreu um erro interno no servidor.'
        }));
    });

    // Teste 3: SequelizeUniqueConstraintError (409)
    it('deve retornar 409 para SequelizeUniqueConstraintError', () => {
        // Arrange: Simula erro de email já em uso
        const mockError = {
            name: 'SequelizeUniqueConstraintError',
            errors: [{ path: 'email', message: 'email must be unique' }]
        };

        // Act
        errorHandler(mockError, req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Um registro com este valor já existe.',
            details: [{ field: 'email', message: 'email must be unique' }]
        }));
    });

    // Teste 4: SequelizeForeignKeyConstraintError (400)
    it('deve retornar 400 para SequelizeForeignKeyConstraintError', () => {
        // Arrange
        const mockError = {
            name: 'SequelizeForeignKeyConstraintError',
        };

        // Act
        errorHandler(mockError, req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Erro de referência: registro relacionado não existe.'
        }));
    });
});