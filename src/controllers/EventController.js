const db = require('../config/database');
const { CustomError } = require('../middlewares/errorHandler');

const Event = db.Event;

// [POST] /events - Cria um novo evento
exports.createEvent = async (req, res, next) => {
    try {
        const { title, date, price, capacity, location_id } = req.body;
        const creator_id = req.user.id;

        // Verifica se o local existe
        const location = await db.Location.findByPk(location_id);
        if (!location) {
            return next(new CustomError('Local não encontrado.', 404));
        }

        const event = await Event.create({
            title, date, price, capacity, location_id, creator_id
        });

        res.status(201).json({
            success: true,
            message: 'Evento criado com sucesso.',
            data: event
        });
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return next(new CustomError('O local especificado não existe.', 400));
        }
        next(error);
    }
};

// [GET] /events - Lista todos os eventos 
exports.listEvents = async (req, res, next) => {
    try {
        const events = await Event.findAll({
            include: [
                { model: db.User, as: 'creator', attributes: ['id', 'name'] },
                { model: db.Location, as: 'location', attributes: ['id', 'name', 'address'] }
            ],
            order: [['date', 'ASC']]
        });

        res.status(200).json({ success: true, data: events });
    } catch (error) {
        next(error);
    }
};

// [GET] /events/:id - Detalhes de um evento
exports.getEventById = async (req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id, {
            include: [
                { model: db.User, as: 'creator', attributes: ['id', 'name'] },
                { model: db.Location, as: 'location' },
                {
                    model: db.Ticket,
                    as: 'tickets',
                    attributes: ['id', 'price_paid'],
                    include: [{ model: db.User, as: 'buyer', attributes: ['id', 'name'] }]
                }
            ]
        });

        if (!event) {
            return next(new CustomError('Evento não encontrado.', 404));
        }

        res.status(200).json({ success: true, data: event });
    } catch (error) {
        next(error);
    }
};

// [PUT] /events/:id - Atualiza um evento 
exports.updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return next(new CustomError('Evento não encontrado.', 404));
        }

        if (event.creator_id !== req.user.id) {
            return next(new CustomError('Você não tem permissão para atualizar este evento.', 403));
        }

        await event.update(req.body);

        res.status(200).json({
            success: true,
            message: 'Evento atualizado com sucesso.',
            data: event
        });

    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return next(new CustomError('O local especificado não existe.', 400));
        }
        next(error);
    }
};

// [DELETE] /events/:id - Deleta um evento 
exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return next(new CustomError('Evento não encontrado.', 404));
        }

        if (event.creator_id !== req.user.id) {
            return next(new CustomError('Você não tem permissão para deletar este evento.', 403));
        }

        await event.destroy();

        res.status(200).json({
            success: true,
            message: 'Evento deletado com sucesso.'
        });
    } catch (error) {
        next(error);
    }
};