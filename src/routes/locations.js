const express = require('express');
const router = express.Router();
const LocationController = require('../controllers/LocationController');
const { createLocationValidation, locationIdParamValidation } = require('../validations/locationValidations');
const validationHandler = require('../middlewares/validationHandler');
const authMiddleware = require('../middlewares/auth');

/**
 * @swagger
 * /locations:
 *   get:
 *     summary: Lista todos os locais
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: Lista de locais
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
 *                     $ref: '#/components/schemas/Location'
 */
router.get('/', LocationController.listLocations);

/**
 * @swagger
 * /locations/{id}:
 *   get:
 *     summary: Obtém detalhes de um local específico
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do local
 *     responses:
 *       200:
 *         description: Detalhes do local
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Location'
 *       404:
 *         description: Local não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', locationIdParamValidation, validationHandler, LocationController.getLocationById);

// Rotas protegidas (Create, Update, Delete)
router.use(authMiddleware);

/**
 * @swagger
 * /locations:
 *   post:
 *     summary: Cria um novo local
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - capacity
 *             properties:
 *               name:
 *                 type: string
 *                 example: Arena de Shows
 *               address:
 *                 type: string
 *                 example: Rua das Flores, 123
 *               capacity:
 *                 type: integer
 *                 example: 1000
 *     responses:
 *       201:
 *         description: Local criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Dados inválidos
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
router.post('/', createLocationValidation, validationHandler, LocationController.createLocation);

/**
 * @swagger
 * /locations/{id}:
 *   put:
 *     summary: Atualiza um local existente
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do local
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Arena de Shows
 *               address:
 *                 type: string
 *                 example: Rua das Flores, 123
 *               capacity:
 *                 type: integer
 *                 example: 1000
 *     responses:
 *       200:
 *         description: Local atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Dados inválidos
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
 *         description: Local não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', locationIdParamValidation, validationHandler, LocationController.updateLocation);

/**
 * @swagger
 * /locations/{id}:
 *   delete:
 *     summary: Deleta um local
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do local
 *     responses:
 *       200:
 *         description: Local deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Não é possível deletar local com eventos associados
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
 *         description: Local não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', locationIdParamValidation, validationHandler, LocationController.deleteLocation);

module.exports = router;