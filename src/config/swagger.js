const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event Manager API',
      version: '1.0.0',
      description: 'API para gerenciamento de eventos, locais e ingressos',
      contact: {
        name: 'API Support',
        url: 'https://github.com/Grezlima18/event-manager',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Servidor de desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'João Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@example.com',
            },
            profile_id: {
              type: 'integer',
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Event: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            title: {
              type: 'string',
              example: 'Show de Rock',
            },
            date: {
              type: 'string',
              format: 'date-time',
              example: '2024-12-31T20:00:00.000Z',
            },
            price: {
              type: 'number',
              format: 'decimal',
              example: 150.00,
            },
            capacity: {
              type: 'integer',
              example: 500,
            },
            creator_id: {
              type: 'integer',
              example: 1,
            },
            location_id: {
              type: 'integer',
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Location: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Arena de Shows',
            },
            address: {
              type: 'string',
              example: 'Rua das Flores, 123',
            },
            capacity: {
              type: 'integer',
              example: 1000,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Ticket: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            code: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            price_paid: {
              type: 'number',
              format: 'decimal',
              example: 150.00,
            },
            user_id: {
              type: 'integer',
              example: 1,
            },
            event_id: {
              type: 'integer',
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'João Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'senha123',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'senha123',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Login realizado com sucesso.',
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  example: 1,
                },
                name: {
                  type: 'string',
                  example: 'João Silva',
                },
                email: {
                  type: 'string',
                  example: 'joao@example.com',
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Erro ao processar requisição',
            },
            error: {
              type: 'string',
              example: 'Detalhes do erro',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operação realizada com sucesso.',
            },
            data: {
              type: 'object',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticação',
      },
      {
        name: 'Users',
        description: 'Endpoints de usuários',
      },
      {
        name: 'Events',
        description: 'Endpoints de eventos',
      },
      {
        name: 'Locations',
        description: 'Endpoints de locais',
      },
      {
        name: 'Tickets',
        description: 'Endpoints de ingressos',
      },
    ],
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

