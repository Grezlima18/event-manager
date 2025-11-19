const db = require('../config/database');
const { CustomError } = require('../middlewares/errorHandler');

const Ticket = db.Ticket;

// [POST] /tickets - Cria um novo ingresso 
exports.createTicket = async (req, res, next) => {
    try {
        const { event_id, price_paid } = req.body;

        // 1. Verifica se o Evento existe
        const event = await db.Event.findByPk(event_id);
        if (!event) {
            return next(new CustomError('Evento não encontrado.', 404));
        }

        // 2. Verifica se ainda há capacidade disponível
        const ticketsCount = await Ticket.count({ where: { event_id } });
        if (ticketsCount >= event.capacity) {
            return next(new CustomError('Evento esgotado. Não há mais ingressos disponíveis.', 400));
        }

        // 3. Criação do Ingresso
        const ticket = await Ticket.create({
            event_id,
            user_id: req.user.id, // Usuário autenticado
            price_paid
        });

        // 4. Busca o ticket criado com relacionamentos
        const ticketWithDetails = await Ticket.findByPk(ticket.id, {
            include: [
                { model: db.User, as: 'buyer', attributes: ['id', 'name', 'email'] },
                { model: db.Event, as: 'event', attributes: ['id', 'title', 'date'] }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Ingresso criado com sucesso.',
            data: ticketWithDetails
        });
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return next(new CustomError('Evento especificado não existe.', 400));
        }
        next(error);
    }
};

// [GET] /tickets - Lista todos os ingressos 
exports.listTickets = async (req, res, next) => {
    try {
        const tickets = await Ticket.findAll({
            include: [
                { model: db.User, as: 'buyer', attributes: ['id', 'name', 'email'] },
                { model: db.Event, as: 'event', attributes: ['id', 'title', 'date'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ success: true, data: tickets });
    } catch (error) {
        next(error);
    }
};

// [GET] /tickets/:id - Detalhes de um ingresso 
exports.getTicketById = async (req, res, next) => {
    try {
        const ticket = await Ticket.findByPk(req.params.id, {
            include: [
                { model: db.User, as: 'buyer', attributes: ['id', 'name', 'email'] },
                { model: db.Event, as: 'event', attributes: ['id', 'title', 'date', 'location_id'] }
            ]
        });

        if (!ticket) {
            return next(new CustomError('Ingresso não encontrado.', 404));
        }

        res.status(200).json({ success: true, data: ticket });
    } catch (error) {
        next(error);
    }
};

// [DELETE] /tickets/:id - Deleta um ingresso 
exports.deleteTicket = async (req, res, next) => {
    try {
        const ticket = await Ticket.findByPk(req.params.id);

        if (!ticket) {
            return next(new CustomError('Ingresso não encontrado.', 404));
        }

        // Autorização: Apenas o comprador pode cancelar o ingresso
        if (ticket.user_id !== req.user.id) {
            return next(new CustomError('Você não tem permissão para cancelar este ingresso.', 403));
        }

        await ticket.destroy();

        res.status(200).json({
            success: true,
            message: 'Ingresso cancelado com sucesso.'
        });
    } catch (error) {
        next(error);
    }
};