const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/auth');
const { updateProfileValidation } = require('../validations/userValidations');
const validationHandler = require('../middlewares/validationHandler');

// Todas as rotas abaixo são protegidas pelo JWT
router.use(authMiddleware);

// [GET] /users/me - Obter perfil do usuário logado
router.get('/me', UserController.getProfile);

// [PUT] /users/me - Atualizar perfil do usuário logado
router.put('/me', updateProfileValidation, validationHandler, UserController.updateProfile);

module.exports = router;