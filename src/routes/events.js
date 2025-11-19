const express = require('express');
const router = express.Router();

const EventController = require('../controllers/EventController');
const { createEventValidation, eventIdParamValidation } = require('../validations/eventValidations');
const validationHandler = require('../middlewares/validationHandler');
const authMiddleware = require('../middlewares/auth');
const rateLimit = require('../middlewares/rateLimiting');

//aa

/* ============================
   ROTAS PÚBLICAS
================================ */

// [GET] /events - Lista eventos (público)
router.get('/', rateLimit(50, 60000), EventController.listEvents);

// [GET] /events/:id - Detalhes de um evento (público)
router.get(
    '/:id',
    eventIdParamValidation,
    validationHandler,
    rateLimit(50, 60000),
    EventController.getEventById
);

/* ============================
   ROTAS PROTEGIDAS
================================ */

router.use(authMiddleware);

// [POST] /events - Criar evento
router.post(
    '/',
    rateLimit(20, 60000),
    createEventValidation,
    validationHandler,
    EventController.createEvent
);

// [PUT] /events/:id - Atualizar evento
router.put(
    '/:id',
    rateLimit(20, 60000),
    eventIdParamValidation,
    validationHandler,
    EventController.updateEvent
);

// [DELETE] /events/:id - Deletar evento
router.delete(
    '/:id',
    rateLimit(20, 60000),
    eventIdParamValidation,
    validationHandler,
    EventController.deleteEvent
);

module.exports = router;