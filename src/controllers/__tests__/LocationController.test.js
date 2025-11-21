const LocationController = require('../LocationController');
const { CustomError } = require('../../middlewares/errorHandler');

// Mock das dependências de Banco de Dados
jest.mock('../../config/database', () => ({
    Location: {
        create: jest.fn(),
        findByPk: jest.fn(),
        destroy: jest.fn(),
    },
    Event: {
        count: jest.fn(),
    },
    // Mock completo para list/getById
    Event: { 
        count: jest.fn(), 
        findAll: jest.fn() 
    }, 
    User: { findAll: jest.fn() }
}));

const db = require('../../config/database');

describe('LocationController - deleteLocation', () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();
        req = { params: { id: 1 } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    it('deve deletar um local com sucesso se não houver eventos associados', async () => {
        // Arrange
        const mockLocation = { id: 1, name: 'Local Vazio', destroy: jest.fn().mockResolvedValue({}) };
        db.Location.findByPk.mockResolvedValue(mockLocation);
        db.Event.count.mockResolvedValue(0); // Nenhuma associação

        // Act
        await LocationController.deleteLocation(req, res, next);

        // Assert
        expect(db.Event.count).toHaveBeenCalledWith({ where: { location_id: 1 } });
        expect(mockLocation.destroy).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Local deletado com sucesso.'
        }));
    });

    it('deve retornar 400 se o local possuir eventos associados', async () => {
        // Arrange
        const mockLocation = { id: 1, name: 'Local Ocupado', destroy: jest.fn() };
        db.Location.findByPk.mockResolvedValue(mockLocation);
        db.Event.count.mockResolvedValue(5); // 5 eventos associados

        // Act
        await LocationController.deleteLocation(req, res, next);

        // Assert
        expect(db.Event.count).toHaveBeenCalledWith({ where: { location_id: 1 } });
        expect(mockLocation.destroy).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Não é possível deletar um local que possui eventos associados.',
            status: 400
        }));
    });
});