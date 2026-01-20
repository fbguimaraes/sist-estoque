# Arquitetura da API - Sistema de Gerenciamento de Estoque

## 🎯 Visão Geral

A API de Gerenciamento de Estoque foi construída seguindo os princípios de arquitetura limpa com o framework **AdonisJS v6**, usando **TypeScript**, **Lucid ORM** e **MySQL**.

## 📐 Padrão Arquitetural

### MVC (Model-View-Controller) Adaptado

```
HTTP Request
     ↓
  Router (/start/routes.ts)
     ↓
  Middleware (Auth, CORS, etc)
     ↓
  Controller
     ↓
  Validator (VineJS)
     ↓
  Service (Lógica de Negócio)
     ↓
  Model (Lucid ORM)
     ↓
  Database (MySQL)
     ↓
  JSON Response
```

## 🗂️ Estrutura de Diretórios

### `/app`

#### `/controllers`
Controllers responsáveis por:
- Receber requisições HTTP
- Validar dados através de Validators
- Chamar Services ou Models
- Retornar respostas JSON

**Controllers implementados:**
- `AuthController` - Autenticação (register, login, logout, me)
- `UsersController` - Gerenciamento de usuários
- `CategoriesController` - CRUD de categorias
- `ProductsController` - CRUD de produtos com estoque
- `StockMovementsController` - Registrar movimentações
- `AlertsController` - Gerenciar alertas

#### `/models`
Models Lucid que:
- Definem estrutura das tabelas
- Implementam relacionamentos
- Contêm hooks do ciclo de vida
- Tipam dados com TypeScript

**Models:**
- `User` - Usuário com autenticação
- `Category` - Categoria de produtos
- `Product` - Produto com estoque
- `StockMovement` - Histórico de movimentações
- `Alert` - Alertas do sistema

#### `/validators`
Validadores VineJS para:
- Validar dados de entrada
- Retornar erros estruturados (422)
- Castear tipos (string → number, etc)

**Validators:**
- `auth.ts` - Registro e login
- `category.ts` - Criação/atualização
- `product.ts` - Criação/atualização
- `stock_movement.ts` - Movimentações
- `alert.ts` - Alertas

#### `/services`
Services para lógica de negócio reutilizável:
- `AlertService` - Verificação e criação de alertas automáticos

### `/database`

#### `/migrations`
Migrations para criar/atualizar banco de dados:
1. `users` - Tabela de usuários
2. `access_tokens` - Tokens de autenticação
3. `categories` - Categorias de produtos
4. `products` - Produtos com FK para categories
5. `stock_movements` - Movimentações com FKs para products e users
6. `alerts` - Alertas com FK para products

**Características:**
- Índices para otimização
- Foreign keys com cascade delete/update
- Timestamps (created_at, updated_at)

### `/start`

#### `routes.ts`
Define todas as rotas da API:
- Agrupa rotas por recurso
- Aplica middleware de autenticação
- Usa prefixo `/api` para namespace

#### `kernel.ts`
Configura middleware stack:
- Server middleware (global)
- Router middleware
- Named middleware (auth, etc)

#### `env.ts`
Valida variáveis de ambiente ao iniciar

### `/config`

Configurações da aplicação:
- `database.ts` - Conexão MySQL
- `auth.ts` - Autenticação por tokens
- `cors.ts` - CORS configurado

### `/tests`

#### `bootstrap.ts`
Setup de testes com Japa:
- Plugins: assert, apiClient, AdonisJS

#### `/functional`
Testes E2E das rotas:
- `auth.spec.ts` - Autenticação
- `categories.spec.ts` - Categorias
- `products.spec.ts` - Produtos
- `stock_movements.spec.ts` - Movimentações
- `alerts.spec.ts` - Alertas

## 🔄 Fluxos Principais

### 1. Fluxo de Autenticação

```
POST /api/auth/register
    ↓
Validar dados (registerValidator)
    ↓
Criar User (password com hash Scrypt)
    ↓
Gerar Access Token
    ↓
Retornar user + token (201)
```

### 2. Fluxo de Movimentação de Estoque

```
POST /api/stock-movements
    ↓
Validar dados + Autenticar
    ↓
Buscar Produto
    ↓
Validar quantidade (saída)
    ↓
Atualizar product.stock_quantity
    ↓
Criar registro StockMovement
    ↓
Verificar estoque mínimo
    ↓
Criar Alert se necessário
    ↓
Retornar movimento (201)
```

### 3. Fluxo de Criação de Produto

```
POST /api/products
    ↓
Autenticar + Validar dados
    ↓
Verificar Category existe
    ↓
Criar Product
    ↓
Preload category
    ↓
Retornar produto (201)
```

## 🔐 Segurança

### Autenticação
- **Método:** Bearer Tokens
- **Storage:** Banco de dados (tabela access_tokens)
- **Hash:** Scrypt para senhas
- **Expiração:** Não implementada (usar em produção)

### Validação
- **Framework:** VineJS
- **Nível:** Controller (antes de salvar)
- **Tipos:** Email, números, enums, etc.

### CORS
- Configurado em `config/cors.ts`
- Permite requisições cross-origin controladas

## 🗄️ Relacionamentos entre Models

```
User
├── HasMany → StockMovements (registra)
└── (pode ter múltiplas movimentações)

Category
├── HasMany → Products (classifica)
└── (contém múltiplos produtos)

Product
├── BelongsTo → Category
├── HasMany → StockMovements
└── HasMany → Alerts (gera)

StockMovement
├── BelongsTo → Product
└── BelongsTo → User

Alert
└── BelongsTo → Product
```

## 📊 Tipos de Dados

### Enums

**StockMovement.type:**
- `entrada` - Entrada de estoque
- `saida` - Saída de estoque

**Alert.alert_type:**
- `estoque_baixo` - Quantidade ≤ minimum_stock
- `fora_estoque` - Quantidade = 0
- `outro` - Alerta manual

**User.role:**
- `user` - Usuário comum
- `admin` - Administrador

## 🎯 Padrões Utilizados

### 1. Dependency Injection
- Usado automaticamente pelo AdonisJS
- Injeção de AuthService, Database, etc

### 2. Validação em Camadas
```
Router → Middleware → Controller → Validator → Model
```

### 3. Lógica de Negócio em Services
- `AlertService` centraliza lógica de alertas
- Reutilizável entre controllers

### 4. Timestamps Automáticos
- `createdAt`: Auto-preenchido na criação
- `updatedAt`: Auto-atualizado em modificações

### 5. Soft Deletes (Não Implementado)
- Considerado para alerts (manter histórico)
- Usar coluna `deleted_at` se necessário

## ⚡ Otimizações

### Database
- Índices em foreign keys
- Índice em `email` (busca rápida)
- Índice em `stock_quantity` (filtros)
- Índice em `movement_date` (ordenação)

### ORM
- Preload de relacionamentos (evita N+1)
- Uso de `query()` builder para filtros
- Prepared statements automáticos

### API
- Paginação (não implementada, adicionar com `.paginate()`)
- Cache (não implementado, usar Redis)
- Rate limiting (não implementado)

## 🚀 Melhorias Futuras

1. **Autenticação**
   - Refresh tokens
   - OAuth2 (Google, GitHub)
   - 2FA (Two-factor authentication)

2. **Performance**
   - Cache com Redis
   - Paginação de listagens
   - Rate limiting por IP

3. **Features**
   - Relatórios de estoque
   - Previsão de demanda
   - Sistema de compras
   - Integração com ERP

4. **Observabilidade**
   - Logging estruturado
   - Tracing distribuído
   - Monitoramento de performance

5. **Testes**
   - Aumentar cobertura de testes
   - Testes de carga
   - Testes de integração

## 📚 Referências

- **AdonisJS Docs:** https://adonisjs.com
- **Lucid ORM:** https://lucid.adonisjs.com
- **VineJS:** https://vinejs.dev
- **MySQL:** https://www.mysql.com
- **TypeScript:** https://www.typescriptlang.org
