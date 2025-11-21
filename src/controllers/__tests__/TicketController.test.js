const TicketController = require('../TicketController');
const { CustomError } = require('../../middlewares/errorHandler');

// Mock das dependências de Banco de Dados
jest.mock('../../config/database', () => ({
    Ticket: {
        create: jest.fn(),
        count: jest.fn(),
        findByPk: jest.fn(), // Necessário para buscar detalhes após a criação
    },
    Event: {
        findByPk: jest.fn(),
    },
    User: { /* Mock omitido */ }
}));

const db = require('../../config/database');

describe('TicketController - createTicket', () => {
    let req, res, next;
    const mockUser = { id: 20 };
    const ticketData = { event_id: 5, price_paid: 100.00 };

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            body: ticketData,
            user: mockUser, // Usuário autenticado
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    it('deve criar um ingresso com sucesso se houver capacidade', async () => {
        // Arrange
        const mockEvent = { id: 5, capacity: 100 };
        const createdTicket = { id: 50, ...ticketData, user_id: 20 };
        const ticketWithDetails = { ...createdTicket, buyer: {}, event: {} }; // Detalhes do include

        db.Event.findByPk.mockResolvedValue(mockEvent);
        db.Ticket.count.mockResolvedValue(99); // 99 ingressos vendidos (capacidade: 100)
        db.Ticket.create.mockResolvedValue(createdTicket);
        db.Ticket.findByPk.mockResolvedValue(ticketWithDetails);

        // Act
        await TicketController.createTicket(req, res, next);

        // Assert
        expect(db.Ticket.count).toHaveBeenCalledWith({ where: { event_id: 5 } });
        expect(db.Ticket.create).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Ingresso criado com sucesso.',
            data: ticketWithDetails
        }));
    });

    it('deve retornar 400 se o Evento estiver esgotado', async () => {
        // Arrange
        const mockEvent = { id: 5, capacity: 100 };

        db.Event.findByPk.mockResolvedValue(mockEvent);
        db.Ticket.count.mockResolvedValue(100); // 100 ingressos vendidos (capacidade: 100)

        // Act
        await TicketController.createTicket(req, res, next);

        // Assert
        expect(db.Ticket.count).toHaveBeenCalledWith({ where: { event_id: 5 } });
        expect(db.Ticket.create).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Evento esgotado. Não há mais ingressos disponíveis.',
            status: 400
        }));
    });
});