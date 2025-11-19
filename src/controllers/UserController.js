const db = require('../config/database');
const jwt = require('jsonwebtoken');
const { CustomError } = require('../middlewares/errorHandler');
require('dotenv').config();

const User = db.User;

const generateToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// [POST] /auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return next(new CustomError('O email fornecido já está em uso.', 409));
        }

        const user = await User.create({ name, email, password, profile_id: 1 });

        const token = generateToken(user);

        res.status(201).json({ 
            success: true, 
            message: 'Usuário registrado com sucesso.', 
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

// [POST] /auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return next(new CustomError('Credenciais inválidas.', 401));
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return next(new CustomError('Credenciais inválidas.', 401));
        }

        const token = generateToken(user);

        res.status(200).json({ 
            success: true, 
            message: 'Login realizado com sucesso.', 
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

// [GET] /users/me - Detalhes do próprio usuário
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email', 'profile_id', 'createdAt'],
            include: [{ model: db.Profile, as: 'profile', attributes: ['name'] }]
        });

        if (!user) {
            return next(new CustomError('Usuário não encontrado.', 404));
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// [PUT] /users/me - Atualiza o próprio perfil 
exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name, email } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return next(new CustomError('Usuário não encontrado.', 404));
        }

        // Verifica se o email já está em uso por outro usuário
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return next(new CustomError('O email fornecido já está em uso.', 409));
            }
        }

        await user.update({ name, email });

        res.status(200).json({ 
            success: true, 
            message: 'Perfil atualizado com sucesso.', 
            data: { 
                id: user.id, 
                name: user.name, 
                email: user.email 
            } 
        });
    } catch (error) {
        next(error);
    }
};