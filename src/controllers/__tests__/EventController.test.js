const EventController = require('../EventController');
const { CustomError } = require('../../middlewares/errorHandler');

// Mock das dependências de Banco de Dados
jest.mock('../../config/database', () => ({
    Event: {
        create: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
        destroy: jest.fn(),
    },
    Location: {
        findByPk: jest.fn(),
    },
    User: { /* Mock de User e Ticket omitidos para este teste */ }
}));

const db = require('../../config/database');

describe('EventController - createEvent', () => {
    let req, res, next;
    const mockUser = { id: 10, name: 'Criador Teste' };
    const eventData = {
        title: 'Show Rock', date: '2025-12-31', price: 50.00, capacity: 500, location_id: 1
    };

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            body: eventData,
            user: mockUser, // Usuário autenticado
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    it('deve criar um novo evento com sucesso', async () => {
        // Arrange
        const mockLocation = { id: 1, name: 'Arena Teste' };
        const createdEvent = { ...eventData, creator_id: 10, id: 100 };
        
        db.Location.findByPk.mockResolvedValue(mockLocation);
        db.Event.create.mockResolvedValue(createdEvent);

        // Act
        await EventController.createEvent(req, res, next);

        // Assert
        expect(db.Location.findByPk).toHaveBeenCalledWith(1);
        expect(db.Event.create).toHaveBeenCalledWith(expect.objectContaining({
            ...eventData,
            creator_id: 10 // Verifica se o ID do usuário autenticado foi usado
        }));
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: true,
            data: createdEvent
        }));
    });

    it('deve retornar 404 se o Local não for encontrado', async () => {
        // Arrange
        db.Location.findByPk.mockResolvedValue(null);

        // Act
        await EventController.createEvent(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Local não encontrado.',
            status: 404
        }));
        expect(db.Event.create).not.toHaveBeenCalled();
    });

    // Teste para updateEvent
    it('deve retornar 403 se o usuário tentar atualizar evento que não criou', async () => {
        // Arrange
        const existingEvent = { id: 100, creator_id: 99, update: jest.fn() };
        db.Event.findByPk.mockResolvedValue(existingEvent);

        // Act
        await EventController.updateEvent(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Você não tem permissão para atualizar este evento.',
            status: 403
        }));
        expect(existingEvent.update).not.toHaveBeenCalled();
    });
});