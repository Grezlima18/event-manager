const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');
const { createTicketValidation, ticketIdParamValidation } = require('../validations/ticketValidations');
const validationHandler = require('../middlewares/validationHandler');
const authMiddleware = require('../middlewares/auth');

// Rotas protegidas
router.use(authMiddleware);

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Lista todos os ingressos
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ingressos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', TicketController.listTickets);

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Obtém detalhes de um ingresso específico
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ingresso
 *     responses:
 *       200:
 *         description: Detalhes do ingresso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Ingresso não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', ticketIdParamValidation, validationHandler, TicketController.getTicketById);

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Cria um novo ingresso
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_id
 *               - price_paid
 *             properties:
 *               event_id:
 *                 type: integer
 *                 example: 1
 *               price_paid:
 *                 type: number
 *                 format: decimal
 *                 example: 150.00
 *     responses:
 *       201:
 *         description: Ingresso criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Dados inválidos, evento não encontrado ou evento esgotado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Evento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createTicketValidation, validationHandler, TicketController.createTicket);

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Cancela um ingresso
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ingresso
 *     responses:
 *       200:
 *         description: Ingresso cancelado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Sem permissão para cancelar este ingresso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Ingresso não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', ticketIdParamValidation, validationHandler, TicketController.deleteTicket);

module.exports = router;