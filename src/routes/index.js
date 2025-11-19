const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const eventRoutes = require('./events');
const locationRoutes = require('./locations');
const ticketRoutes = require('./tickets');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/locations', locationRoutes);
router.use('/tickets', ticketRoutes);

module.exports = router;