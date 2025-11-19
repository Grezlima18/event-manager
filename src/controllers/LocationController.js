const db = require('../config/database');
const { CustomError } = require('../middlewares/errorHandler');

const Location = db.Location;

// [POST] /locations - Cria um novo local 
exports.createLocation = async (req, res, next) => {
    try {
        const location = await Location.create(req.body);

        res.status(201).json({ 
            success: true, 
            message: 'Local criado com sucesso.', 
            data: location 
        });
    } catch (error) {
        next(error);
    }
};

// [GET] /locations - Lista todos os locais 
exports.listLocations = async (req, res, next) => {
    try {
        const locations = await Location.findAll({
            include: [{ 
                model: db.Event, 
                as: 'events', 
                attributes: ['id', 'title', 'date'],
                include: [{ model: db.User, as: 'creator', attributes: ['id', 'name'] }]
            }],
            order: [['name', 'ASC']]
        });

        res.status(200).json({ success: true, data: locations });
    } catch (error) {
        next(error);
    }
};

// [GET] /locations/:id - Detalhes de um local 
exports.getLocationById = async (req, res, next) => {
    try {
        const location = await Location.findByPk(req.params.id, {
            include: [{ 
                model: db.Event, 
                as: 'events', 
                attributes: ['id', 'title', 'date', 'creator_id'],
                include: [{ model: db.User, as: 'creator', attributes: ['id', 'name'] }]
            }]
        });

        if (!location) {
            return next(new CustomError('Local não encontrado.', 404));
        }

        res.status(200).json({ success: true, data: location });
    } catch (error) {
        next(error);
    }
};

// [PUT] /locations/:id - Atualiza um local 
exports.updateLocation = async (req, res, next) => {
    try {
        const location = await Location.findByPk(req.params.id);

        if (!location) {
            return next(new CustomError('Local não encontrado.', 404));
        }

        await location.update(req.body);
        
        res.status(200).json({ 
            success: true, 
            message: 'Local atualizado com sucesso.', 
            data: location 
        });

    } catch (error) {
        next(error);
    }
};

// [DELETE] /locations/:id - Deleta um local 
exports.deleteLocation = async (req, res, next) => {
    try {
        const location = await Location.findByPk(req.params.id);

        if (!location) {
            return next(new CustomError('Local não encontrado.', 404));
        }

        // Verifica se existem eventos associados a este local
        const eventsCount = await db.Event.count({ where: { location_id: location.id } });
        if (eventsCount > 0) {
            return next(new CustomError('Não é possível deletar um local que possui eventos associados.', 400));
        }

        await location.destroy();
        
        res.status(200).json({ 
            success: true, 
            message: 'Local deletado com sucesso.' 
        });
    } catch (error) {
        next(error);
    }
};