const express = require('express');
const router = express.Router();
const LocationController = require('../controllers/LocationController');
const { createLocationValidation, locationIdParamValidation } = require('../validations/locationValidations');
const validationHandler = require('../middlewares/validationHandler');
const authMiddleware = require('../middlewares/auth');

// Rotas públicas
router.get('/', LocationController.listLocations);
router.get('/:id', locationIdParamValidation, validationHandler, LocationController.getLocationById);

// Rotas protegidas (Create, Update, Delete)
router.use(authMiddleware);

// [POST] /locations - Criar local
router.post('/', createLocationValidation, validationHandler, LocationController.createLocation);

// [PUT] /locations/:id - Atualizar local
router.put('/:id', locationIdParamValidation, validationHandler, LocationController.updateLocation);

// [DELETE] /locations/:id - Deletar local
router.delete('/:id', locationIdParamValidation, validationHandler, LocationController.deleteLocation);

module.exports = router;