const UserController = require('../UserController');
const jwt = require('jsonwebtoken');
const { CustomError } = require('../../middlewares/errorHandler');

// Mock das dependências
jest.mock('../../config/database', () => ({
    User: {
        findOne: jest.fn(),
        create: jest.fn(),
    }
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

jest.mock('dotenv', () => ({
    config: jest.fn(),
}));

const db = require('../../config/database');

describe('UserController - register', () => {
    let req, res, next;

    beforeEach(() => {
        // Reset dos mocks antes de cada teste
        jest.clearAllMocks();

        // Mock do request
        req = {
            body: {
                name: 'João Silva',
                email: 'joao@example.com',
                password: 'senha123'
            }
        };

        // Mock do response
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        // Mock do next (middleware de erro)
        next = jest.fn();

        // Configurar variáveis de ambiente
        process.env.JWT_SECRET = 'test-secret';
        process.env.JWT_EXPIRES_IN = '1h';
    });

    it('deve registrar um novo usuário com sucesso', async () => {
        // Arrange
        const mockUser = {
            id: 1,
            name: 'João Silva',
            email: 'joao@example.com',
            profile_id: 1
        };

        const mockToken = 'mock-jwt-token';

        // Mock: não existe usuário com esse email
        db.User.findOne.mockResolvedValue(null);
        
        // Mock: criação do usuário
        db.User.create.mockResolvedValue(mockUser);
        
        // Mock: geração do token
        jwt.sign.mockReturnValue(mockToken);

        // Act
        await UserController.register(req, res, next);

        // Assert
        expect(db.User.findOne).toHaveBeenCalledWith({ where: { email: 'joao@example.com' } });
        expect(db.User.create).toHaveBeenCalledWith({
            name: 'João Silva',
            email: 'joao@example.com',
            password: 'senha123',
            profile_id: 1
        });
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: 1 },
            'test-secret',
            { expiresIn: '1h' }
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Usuário registrado com sucesso.',
            token: mockToken,
            user: {
                id: 1,
                name: 'João Silva',
                email: 'joao@example.com'
            }
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro quando o email já está em uso', async () => {
        // Arrange
        const existingUser = {
            id: 2,
            email: 'joao@example.com'
        };

        // Mock: já existe usuário com esse email
        db.User.findOne.mockResolvedValue(existingUser);

        // Act
        await UserController.register(req, res, next);

        // Assert
        expect(db.User.findOne).toHaveBeenCalledWith({ where: { email: 'joao@example.com' } });
        expect(db.User.create).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'O email fornecido já está em uso.',
                status: 409
            })
        );
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('deve chamar next com erro em caso de falha no banco de dados', async () => {
        // Arrange
        const dbError = new Error('Erro de conexão com o banco');

        // Mock: erro ao buscar usuário
        db.User.findOne.mockRejectedValue(dbError);

        // Act
        await UserController.register(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith(dbError);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});

