const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { registerValidation, loginValidation } = require('../validations/userValidations');
const validationHandler = require('../middlewares/validationHandler');

// [POST] /auth/register - Cadastro de novo usuário
router.post('/register', registerValidation, validationHandler, UserController.register);

// [POST] /auth/login - Login e obtenção do JWT
router.post('/login', loginValidation, validationHandler, UserController.login);

module.exports = router;