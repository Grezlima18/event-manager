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

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Lista todos os eventos
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Lista de eventos
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
 *                     $ref: '#/components/schemas/Event'
 */
router.get('/', rateLimit(50, 60000), EventController.listEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Obtém detalhes de um evento específico
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Detalhes do evento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Cria um novo evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *               - price
 *               - capacity
 *               - location_id
 *             properties:
 *               title:
 *                 type: string
 *                 example: Show de Rock
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: '2024-12-31T20:00:00.000Z'
 *               price:
 *                 type: number
 *                 format: decimal
 *                 example: 150.00
 *               capacity:
 *                 type: integer
 *                 example: 500
 *               location_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Dados inválidos ou local não encontrado
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
 */
router.post(
    '/',
    rateLimit(20, 60000),
    createEventValidation,
    validationHandler,
    EventController.createEvent
);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Atualiza um evento existente
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Show de Rock
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: '2024-12-31T20:00:00.000Z'
 *               price:
 *                 type: number
 *                 format: decimal
 *                 example: 150.00
 *               capacity:
 *                 type: integer
 *                 example: 500
 *               location_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Dados inválidos ou local não encontrado
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
 *       403:
 *         description: Sem permissão para atualizar este evento
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
router.put(
    '/:id',
    rateLimit(20, 60000),
    eventIdParamValidation,
    validationHandler,
    EventController.updateEvent
);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Deleta um evento
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Evento deletado com sucesso
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
 *         description: Sem permissão para deletar este evento
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
router.delete(
    '/:id',
    rateLimit(20, 60000),
    eventIdParamValidation,
    validationHandler,
    EventController.deleteEvent
);

module.exports = router;