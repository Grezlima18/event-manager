
// Força Node a usar IPv4 primeiro
require('dns').setDefaultResultOrder('ipv4first');

// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const ipLogger = require('./src/middlewares/ipLogger');

require('dotenv').config();

// Carrega a configuração do banco de dados e a classe CustomError
const db = require('./src/config/database');
const { errorHandler, CustomError } = require('./src/middlewares/errorHandler');

// --- Inicialização do Express ---
const app = express();

// --- Middlewares Globais ---
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(ipLogger);

// --- Swagger Documentation ---
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Event Manager API Documentation'
}));

// Rota de health check
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: "Event Management API - Online",
    version: "1.0.0",
    docs: "/api-docs"
  });
});

// --- Rotas da API ---
const apiRoutes = require('./src/routes/index');
app.use('/api/v1/', apiRoutes);

// --- Rotas de Erro 404 ---
app.use((req, res, next) => {
  next(new CustomError(`Recurso não encontrado para a rota: ${req.originalUrl}`, 404));
});

// --- Middleware de Tratamento de Erro Global ---
app.use(errorHandler);

// --- Sincronização e Inicialização do Servidor ---
const PORT = process.env.PORT || 3000;

db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Database conectado com sucesso.');
    return db.sequelize.sync({ force: false });
  })
  .then(() => {
    console.log('✅ Modelos sincronizados.');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}/api/v1/`);
    });
  })
  .catch(err => {
    console.error('❌ Erro FATAL ao conectar/sincronizar o banco de dados:', err.message);
    process.exit(1);
  });