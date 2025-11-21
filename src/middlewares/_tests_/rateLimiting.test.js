const rateLimit = require('../rateLimiting');
const { CustomError } = require('../errorHandler');

// Mock do Date.now para controlar o tempo
const mockDateNow = jest.spyOn(Date, 'now');

describe('rateLimit Middleware', () => {
    let req, res, next;
    const limit = 3;
    const windowMs = 5000; // 5 segundos

    // Cria uma nova instância do middleware para cada teste (isola o 'requests' entre testes)
    const rateLimitMiddleware = rateLimit(limit, windowMs);
    
    beforeEach(() => {
        req = { ip: '127.0.0.1' };
        res = {};
        next = jest.fn();
        jest.clearAllMocks();
        mockDateNow.mockReturnValue(10000); // Define o tempo inicial como 10000ms
    });

    afterAll(() => {
        mockDateNow.mockRestore(); // Restaura a função Date.now original
    });

    it('deve permitir as requisições até o limite', () => {
        // 1ª requisição
        rateLimitMiddleware(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
        
        // 2ª requisição
        rateLimitMiddleware(req, res, next);
        expect(next).toHaveBeenCalledTimes(2);

        // 3ª requisição (Limite)
        rateLimitMiddleware(req, res, next);
        expect(next).toHaveBeenCalledTimes(3);
    });

    it('deve bloquear a requisição após o limite (status 429)', () => {
        // Arrange: 3 requisições permitidas
        rateLimitMiddleware(req, res, next);
        rateLimitMiddleware(req, res, next);
        rateLimitMiddleware(req, res, next);
        
        // Act: 4ª requisição (Bloqueada)
        rateLimitMiddleware(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledTimes(4); // 3x next() + 1x next(Error)
        expect(next.mock.calls[3][0]).toBeInstanceOf(CustomError);
        expect(next.mock.calls[3][0].status).toBe(429);
        expect(next.mock.calls[3][0].message).toBe('Muitas requisições. Tente novamente mais tarde.');
    });

    it('deve resetar o contador após o tempo da janela', () => {
        // 1ª, 2ª, 3ª requisições (Limite)
        rateLimitMiddleware(req, res, next);
        rateLimitMiddleware(req, res, next);
        rateLimitMiddleware(req, res, next);

        // Avança o tempo (tempo inicial 10000ms + janela de 5000ms = 15000ms)
        mockDateNow.mockReturnValue(15001); 

        // 4ª requisição (Deve ser permitida, pois a janela resetou)
        rateLimitMiddleware(req, res, next); 
        
        expect(next).toHaveBeenCalledTimes(4);
        // O último next() deve ser bem-sucedido (não deve ser um erro)
        expect(next.mock.calls[3][0]).toBeUndefined(); 
    });
});