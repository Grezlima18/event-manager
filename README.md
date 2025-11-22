# Event Manager - API


## Tecnologias utilizadas
- Node.js + Express
- Sequelize (ORM)
- PostgreSQL (suporta NeonDB / conexões SSL)
- JWT para autenticação
- bcryptjs para hashing de senhas
- Swagger (swagger-jsdoc + swagger-ui-express) para documentação
- Helmet, CORS, Winston (logging)
- Jest para testes

## Como rodar localmente
1. Clone o repositório:
   git clone https://github.com/Grezlima18/event-manager.git
2. Instale dependências:
   npm install
3. Crie um arquivo `.env` na raiz com as variáveis necessárias (exemplo abaixo).
4. Rode em modo desenvolvimento (nodemon):
   npm run dev
   ou em produção:
   npm start
5. A API ficará disponível em: `http://localhost:3000/api/v1/` (ou na porta definida em `PORT`).

## Como configurar banco de dados
- O projeto usa a variável de ambiente `DATABASE_URL` com a URL completa de conexão PostgreSQL.
- Para uso local com Postgres, um exemplo de `DATABASE_URL`:
  postgres://usuario:senha@localhost:5432/nome_do_banco
- Em provedores como NeonDB ou Heroku Postgres, cole a URL fornecida diretamente em `DATABASE_URL`.
- O Sequelize sincroniza os modelos automaticamente ao iniciar (sem `force`).

Exemplo mínimo de arquivo `.env`:

PORT=3000
DATABASE_URL=postgres://usuario:senha@host:5432/nome_do_banco
JWT_SECRET=sua_chave_secreta
NODE_ENV=development

Observação: ao usar Neon/Provedores que exigem SSL, o projeto já habilita `ssl` e `rejectUnauthorized: false` nas opções do Sequelize.

## Como acessar a documentação Swagger
- Após iniciar a aplicação localmente, abra:
  http://localhost:3000/api-docs
- A documentação é gerada a partir dos arquivos de rota em `src/routes` e está integrada via `swagger-ui-express`.

## Testes
- Execute a suíte de testes com:
  npm test

## Deploy (link funcional da API na nuvem)
- Link do deploy funcional: https://event-manager-8k0q.onrender.com/api/v1/

## *Sequência Recomendada para Testar no Postman:*

1. *Registrar usuário* (POST /auth/register)
2. *Login* (POST /auth/login) - *SALVAR O TOKEN*
3. *Criar local* (POST /locations) - usar token
4. *Criar evento* (POST /events) - usar token
5. *Comprar ingresso* (POST /tickets) - usar token
6. *Listar tudo* (GET /events, /locations, /tickets)

*Headers para rotas protegidas:*
Authorization: Bearer seu_token_jwt
Content-Type: application/json

---

