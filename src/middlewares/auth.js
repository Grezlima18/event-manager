const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { CustomError } = require('./errorHandler');

require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new CustomError('Token de autenticação não fornecido ou inválido.', 401));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await db.User.findByPk(decoded.id, {
            attributes: ['id', 'name', 'email', 'profile_id']
        });

        if (!user) {
            return next(new CustomError('Usuário associado ao token não encontrado.', 404));
        }

        req.user = user;
        next();
    } catch (err) {
        return next(new CustomError('Token inválido ou expirado. Acesse novamente.', 401));
    }
};

module.exports = authMiddleware;