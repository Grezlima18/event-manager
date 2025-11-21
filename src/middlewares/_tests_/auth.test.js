const authMiddleware = require('../auth');
const jwt = require('jsonwebtoken');
const { CustomError } = require('../errorHandler');

// Mocks
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));
jest.mock('../../config/database', () => ({
    User: {
        findByPk: jest.fn(),
    },
}));
jest.mock('dotenv', () => ({ config: jest.fn() }));

const db = require('../../config/database');

describe('authMiddleware', () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = 'test-secret';
        req = {
            headers: {},
        };
        res = {};
        next = jest.fn();
    });

    it('deve chamar next(CustomError 401) se o header Authorization estiver ausente', async () => {
        req.headers.authorization = undefined;

        await authMiddleware(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Token de autenticação não fornecido ou inválido.',
            status: 401
        }));
    });

    it('deve chamar next(CustomError 401) se o token não começar com "Bearer "', async () => {
        req.headers.authorization = 'InvalidToken';

        await authMiddleware(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Token de autenticação não fornecido ou inválido.',
            status: 401
        }));
    });

    it('deve chamar next(CustomError 401) se o token for inválido', async () => {
        req.headers.authorization = 'Bearer token.invalido';
        jwt.verify.mockImplementation(() => { throw new Error('JWT malformed'); });

        await authMiddleware(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Token inválido ou expirado. Acesse novamente.',
            status: 401
        }));
    });

    it('deve anexar o usuário em req.user e chamar next() em caso de sucesso', async () => {
        // Arrange
        const mockDecoded = { id: 10 };
        const mockUser = { id: 10, name: 'Auth User' };

        req.headers.authorization = 'Bearer valid.jwt.token';
        jwt.verify.mockReturnValue(mockDecoded);
        db.User.findByPk.mockResolvedValue(mockUser);

        // Act
        await authMiddleware(req, res, next);

        // Assert
        expect(jwt.verify).toHaveBeenCalledWith('valid.jwt.token', 'test-secret');
        expect(db.User.findByPk).toHaveBeenCalledWith(10, expect.any(Object));
        expect(req.user.id).toBe(10);
        expect(next).toHaveBeenCalledWith();
    });

    it('deve chamar next(CustomError 404) se o usuário do token não for encontrado', async () => {
        // Arrange
        req.headers.authorization = 'Bearer valid.jwt.token';
        jwt.verify.mockReturnValue({ id: 99 });
        db.User.findByPk.mockResolvedValue(null);

        // Act
        await authMiddleware(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Usuário associado ao token não encontrado.',
            status: 404
        }));
    });
});