const express = require('express');
const router = express.Router();
const EventController = require('../controllers/EventController');
const { createEventValidation, eventIdParamValidation } = require('../validations/eventValidations');
const validationHandler = require('../middlewares/validationHandler');
const authMiddleware = require('../middlewares/auth');

// Rotas públicas
router.get('/', EventController.listEvents);
router.get('/:id', eventIdParamValidation, validationHandler, EventController.getEventById);

// Rotas protegidas (Create, Update, Delete)
router.use(authMiddleware);

// [POST] /events - Criar evento
router.post('/', createEventValidation, validationHandler, EventController.createEvent);

// [PUT] /events/:id - Atualizar evento
router.put('/:id', eventIdParamValidation, validationHandler, EventController.updateEvent);

// [DELETE] /events/:id - Deletar evento
router.delete('/:id', eventIdParamValidation, validationHandler, EventController.deleteEvent);

module.exports = router;