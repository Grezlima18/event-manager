// Crie um arquivo para simular a dependência express-validator
// Exemplo de mock:
// jest.mock('express-validator', () => ({
//     validationResult: jest.fn(),
// }));

const validationHandler = require('../validationHandler');

// Mock da função validationResult do express-validator
const mockValidationResult = jest.fn();
jest.mock('express-validator', () => ({
    validationResult: (req) => mockValidationResult(req)
}));

describe('validationHandler', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {};
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('deve chamar next() se não houver erros de validação', () => {
        // Arrange
        mockValidationResult.mockReturnValue({
            isEmpty: () => true,
            array: () => []
        });

        // Act
        validationHandler(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith();
        expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    });

    it('deve chamar next(CustomError 400) e formatar detalhes dos erros de validação', () => {
        // Arrange
        const mockErrors = [
            { path: 'name', msg: 'Nome é obrigatório', value: '' },
            { path: 'email', msg: 'Email inválido', value: 'a@a' }
        ];
        
        mockValidationResult.mockReturnValue({
            isEmpty: () => false,
            array: () => mockErrors
        });

        // Act
        validationHandler(req, res, next);

        // Assert
        const error = next.mock.calls[0][0]; // Pega o erro passado para next()
        
        expect(error.status).toBe(400);
        expect(error.message).toBe('Erro de validação dos dados fornecidos.');
        expect(error.details).toEqual([
            { field: 'name', message: 'Nome é obrigatório', value: '' },
            { field: 'email', message: 'Email inválido', value: 'a@a' }
        ]);
    });
});