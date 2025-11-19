const express = require('express');
const cors = require('cors');
const rateLimit = require('./middlewares/rateLimiting');
const ipLogger = require('./middlewares/ipLogger');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimit(100, 60000));
app.use(ipLogger);

app.get('/', (req, res) => {
  res.json({ message: "Event Management API - Online" });
});

module.exports = app;

//teste
