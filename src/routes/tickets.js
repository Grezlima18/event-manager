const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');
const { createTicketValidation, ticketIdParamValidation } = require('../validations/ticketValidations');
const validationHandler = require('../middlewares/validationHandler');
const authMiddleware = require('../middlewares/auth');

// Rotas protegidas
router.use(authMiddleware);

// [GET] /tickets - Listar ingressos
router.get('/', TicketController.listTickets);

// [GET] /tickets/:id - Obter ingresso por ID
router.get('/:id', ticketIdParamValidation, validationHandler, TicketController.getTicketById);

// [POST] /tickets - Criar ingresso
router.post('/', createTicketValidation, validationHandler, TicketController.createTicket);

// [DELETE] /tickets/:id - Deletar ingresso
router.delete('/:id', ticketIdParamValidation, validationHandler, TicketController.deleteTicket);

module.exports = router;