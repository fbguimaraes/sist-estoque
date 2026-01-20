# Sistema de Gerenciamento de Estoque

API REST completa para gerenciamento de estoque de produtos, desenvolvida com **AdonisJS v6**, **TypeScript**, **Lucid ORM** e **MySQL**.

## 📋 Documentação do Projeto

Este projeto foi gerado a partir de um diagrama de banco de dados e implementa uma API completa com todas as operações CRUD, autenticação por token e gestão de alertas de estoque.

### Entidades do Sistema

#### **USERS** - Usuários do Sistema
- `id` (PK): Identificador único
- `name`: Nome do usuário
- `email` (UK): Email único
- `password`: Senha criptografada
- `role`: Papel do usuário (admin, user, etc)
- `created_at`, `updated_at`: Timestamps

#### **CATEGORIES** - Categorias de Produtos
- `id` (PK): Identificador único
- `name` (UK): Nome da categoria
- `description`: Descrição
- `created_at`, `updated_at`: Timestamps
- Relacionamento 1:N com PRODUCTS (classifica)

#### **PRODUCTS** - Produtos em Estoque
- `id` (PK): Identificador único
- `name` (UK): Nome do produto
- `description`: Descrição
- `price`: Preço
- `stock_quantity`: Quantidade em estoque
- `minimum_stock`: Quantidade mínima
- `category_id` (FK): Referência à categoria
- `created_at`, `updated_at`: Timestamps
- Relacionamentos: BelongsTo Category, HasMany StockMovements, HasMany Alerts

#### **STOCK_MOVEMENTS** - Movimentações de Estoque
- `id` (PK): Identificador único
- `product_id` (FK): Referência ao produto
- `user_id` (FK): Usuário que registrou
- `type`: Tipo de movimento (entrada/saida)
- `quantity`: Quantidade movimentada
- `movement_date`: Data do movimento
- `created_at`: Timestamp
- Relacionamentos: BelongsTo Product, BelongsTo User

#### **ALERTS** - Alertas do Sistema
- `id` (PK): Identificador único
- `product_id` (FK): Referência ao produto
- `alert_type`: Tipo de alerta (estoque_baixo/fora_estoque/outro)
- `message`: Mensagem do alerta
- `is_read`: Flag de leitura
- `created_at`: Timestamp
- Relacionamento: BelongsTo Product (gera)

## 🚀 Começando

### Pré-requisitos

- Node.js (v20 ou superior)
- npm ou yarn
- MySQL 8.0+

### Instalação

1. **Clonar o repositório**
   ```bash
   git clone <repository-url>
   cd SistEstoque
   ```

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Configurar variáveis de ambiente**
   
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   NODE_ENV=development
   APP_KEY=<seu-app-key>
   PORT=3333
   HOST=127.0.0.1
   LOG_LEVEL=info
   
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=root
   DB_DATABASE=sist_estoque
   ```

4. **Criar banco de dados**
   ```bash
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS sist_estoque CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```

5. **Executar migrations**
   ```bash
   npm run migration:run
   # ou
   node ace migration:run
   ```

6. **Iniciar servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

O servidor estará disponível em `http://localhost:3333`

## 🔌 Endpoints da API

### Autenticação (Público)

#### Registrar Novo Usuário
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha_segura_123"
}
```

**Resposta (201 Created):**
```json
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "user",
    "createdAt": "2026-01-20T14:30:03.000-03:00",
    "updatedAt": "2026-01-20T14:30:03.000-03:00"
  },
  "token": "oat_Mg.V2NvSnpjMDJyX01pT3pzWUdaSGFlc01FWEVxNlZvQllPdzFYSEJoNjMyMzIxMDEwMzg"
}
```

#### Fazer Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha_segura_123"
}
```

### Operações Protegidas (Requer Token)

Use o header `Authorization: Bearer <token>` em todas as requisições protegidas.

#### Autenticação

- `GET /api/auth/me` - Obter dados do usuário autenticado
- `POST /api/auth/logout` - Fazer logout (revoga token)

#### Usuários

- `GET /api/users` - Listar todos os usuários
- `GET /api/users/:id` - Obter dados de um usuário
- `PATCH /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

#### Categorias

- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria
- `GET /api/categories/:id` - Obter categoria com produtos
- `PATCH /api/categories/:id` - Atualizar categoria
- `DELETE /api/categories/:id` - Deletar categoria

#### Produtos

- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto
- `GET /api/products/:id` - Obter detalhes do produto
- `PATCH /api/products/:id` - Atualizar produto
- `PATCH /api/products/:id/stock` - Atualizar estoque
- `DELETE /api/products/:id` - Deletar produto

#### Movimentações de Estoque

- `GET /api/stock-movements` - Listar movimentações
- `POST /api/stock-movements` - Registrar nova movimentação
- `GET /api/stock-movements/:id` - Obter movimentação
- `GET /api/stock-movements/product/:productId` - Listar movimentações por produto

#### Alertas

- `GET /api/alerts` - Listar todos os alertas
- `POST /api/alerts` - Criar alerta manual
- `GET /api/alerts/:id` - Obter alerta específico
- `PATCH /api/alerts/:id/read` - Marcar como lido
- `DELETE /api/alerts/:id` - Deletar alerta
- `GET /api/alerts/unread/list` - Listar alertas não lidos
- `PATCH /api/alerts/all/mark-read` - Marcar todos como lidos

## 📊 Exemplos de Uso

### Criar uma Categoria

```bash
curl -X POST http://localhost:3333/api/categories \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Eletrônicos",
    "description": "Produtos eletrônicos diversos"
  }'
```

### Criar um Produto

```bash
curl -X POST http://localhost:3333/api/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Notebook Dell",
    "description": "Notebook Dell Core i7",
    "price": 3500.50,
    "stockQuantity": 10,
    "minimumStock": 2,
    "categoryId": 1
  }'
```

### Registrar Entrada de Estoque

```bash
curl -X POST http://localhost:3333/api/stock-movements \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "type": "entrada",
    "quantity": 5
  }'
```

## 🧪 Executar Testes

```bash
npm run test
# ou
node ace test
```

Os testes cobrem:
- ✅ Autenticação (registro, login, logout)
- ✅ Operações CRUD de Categorias
- ✅ Operações CRUD de Produtos
- ✅ Movimentações de Estoque
- ✅ Alertas do Sistema
- ✅ Validações de Dados

## 🏗️ Estrutura do Projeto

```
.
├── app/
│   ├── controllers/       # Controllers dos endpoints
│   ├── models/           # Models Lucid (User, Category, Product, etc)
│   ├── services/         # Serviços de lógica de negócio
│   └── validators/       # Validadores VineJS
├── database/
│   ├── migrations/       # Migrations de criação de tabelas
│   └── seeders/         # Seeds para dados iniciais (opcional)
├── tests/
│   ├── bootstrap.ts     # Configuração dos testes
│   └── functional/      # Testes funcionais
├── start/
│   ├── routes.ts        # Definição de rotas
│   ├── kernel.ts        # Middleware stack
│   └── env.ts          # Validação de variáveis de ambiente
├── config/
│   ├── database.ts      # Configuração do banco
│   ├── auth.ts         # Configuração de autenticação
│   └── cors.ts         # Configuração CORS
└── .env.example         # Exemplo de variáveis de ambiente
```

## 🔐 Autenticação

A API utiliza **Access Tokens** baseados em banco de dados.

### Fluxo de Autenticação

1. **Registrar** um novo usuário em `/api/auth/register`
2. Recebe um `token` na resposta
3. Utilizar o `token` no header `Authorization: Bearer <token>` para acessar rotas protegidas
4. **Logout** revoga o token em `/api/auth/logout`

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `NODE_ENV` | `development` | Ambiente (development/production/test) |
| `APP_KEY` | - | Chave da aplicação para criptografia |
| `PORT` | `3333` | Porta do servidor HTTP |
| `HOST` | `127.0.0.1` | Host do servidor |
| `LOG_LEVEL` | `info` | Nível de log (fatal/error/warn/info/debug) |
| `DB_HOST` | `127.0.0.1` | Host do banco MySQL |
| `DB_PORT` | `3306` | Porta do MySQL |
| `DB_USER` | `root` | Usuário do banco |
| `DB_PASSWORD` | - | Senha do banco |
| `DB_DATABASE` | `sist_estoque` | Nome do banco |

## 📦 Dependências Principais

- **@adonisjs/core** - Framework web
- **@adonisjs/lucid** - ORM para MySQL
- **@adonisjs/auth** - Sistema de autenticação
- **@vinejs/vine** - Validação de dados
- **mysql2** - Driver MySQL
- **luxon** - Manipulação de datas

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'feat: add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

## 📝 Commit Message Convention

Este projeto segue **Conventional Commits**:

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `test:` Adição/modificação de testes
- `docs:` Documentação
- `refactor:` Refatoração sem alterar funcionalidade
- `chore:` Tarefas de manutenção

## 📄 Licença

Este projeto está sob licença MIT.

## 👤 Autor

Sistema de Gerenciamento de Estoque - Desenvolvido com AdonisJS v6

---

**Última Atualização:** 20 de Janeiro de 2026
