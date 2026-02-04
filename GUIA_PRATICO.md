# 📖 Guia Prático de Uso da API

Aprenda como usar a API de Gerenciamento de Estoque com exemplos práticos passo a passo.

---

## 🚀 Iniciando o Servidor

Antes de tudo, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O servidor estará disponível em: **http://127.0.0.1:3333**

---

## 🔐 1. AUTENTICAÇÃO

Toda a API, exceto autenticação, requer um **Bearer Token**. 

### 1.1 Registrar um Novo Usuário

```bash
curl -X POST http://127.0.0.1:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123456"
  }'
```

**Resposta esperada (201 Created):**
```json
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "user",
    "createdAt": "2026-01-20T14:39:55.609-03:00",
    "updatedAt": "2026-01-20T14:39:55.609-03:00"
  },
  "token": "oat_NA.UE42U0RlVG5sSE9HVzRGY0V6Qy1JU3R2dTlKZG5PeDZjdEpCbkE1djIzOTU0NjU3NA"
}
```

**Pontos Importantes:**
- ✅ Senha mínimo 8 caracteres
- ✅ Email deve ser único
- ✅ A resposta inclui um token para usar em outras requisições

### 1.2 Fazer Login

```bash
curl -X POST http://127.0.0.1:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123456"
  }'
```

**Resposta (201 Created):**
```json
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "user",
    "createdAt": "2026-01-20T14:39:55.000-03:00",
    "updatedAt": "2026-01-20T14:39:55.000-03:00"
  },
  "token": "oat_NQ.d2c2WUFycmhwOWx4OFpkZHZsUGlIeVhhTGF1ckZrelBoVmVnMU9NZzQyNDY1NzEzNDk"
}
```

### 1.3 Usar o Token

Guarde o token e use em todas as próximas requisições:

```bash
# Formato padrão
-H "Authorization: Bearer {seu_token}"

# Exemplo completo
curl -X GET http://127.0.0.1:3333/api/auth/me \
  -H "Authorization: Bearer oat_NQ.d2c2WUFycmhwOWx4OFpkZHZsUGlIeVhhTGF1ckZrelBoVmVnMU9NZzQyNDY1NzEzNDk"
```

### 1.4 Obter Dados do Usuário Autenticado

```bash
curl -X GET http://127.0.0.1:3333/api/auth/me \
  -H "Authorization: Bearer {seu_token}"
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "user"
}
```

### 1.5 Logout

```bash
curl -X POST http://127.0.0.1:3333/api/auth/logout \
  -H "Authorization: Bearer {seu_token}"
```

**Resposta (200 OK):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

## 📦 2. CATEGORIAS

Gerenciar categorias de produtos.

### 2.1 Criar Categoria

```bash
curl -X POST http://127.0.0.1:3333/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu_token}" \
  -d '{
    "name": "Eletrônicos",
    "description": "Produtos eletrônicos diversos"
  }'
```

**Resposta (201 Created):**
```json
{
  "id": 1,
  "name": "Eletrônicos",
  "description": "Produtos eletrônicos diversos",
  "createdAt": "2026-01-20T14:40:17.000-03:00",
  "updatedAt": "2026-01-20T14:40:17.000-03:00"
}
```

**Validações:**
- ✅ Nome obrigatório (mínimo 3 caracteres)
- ✅ Descrição opcional
- ✅ Nome deve ser único

### 2.2 Listar Categorias

```bash
curl -X GET http://127.0.0.1:3333/api/categories \
  -H "Authorization: Bearer {seu_token}"
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Eletrônicos",
    "description": "Produtos eletrônicos diversos",
    "createdAt": "2026-01-20T14:40:17.000-03:00",
    "updatedAt": "2026-01-20T14:40:17.000-03:00"
  },
  {
    "id": 2,
    "name": "Periféricos",
    "description": "Periféricos e acessórios",
    "createdAt": "2026-01-20T14:40:25.000-03:00",
    "updatedAt": "2026-01-20T14:40:25.000-03:00"
  }
]
```

### 2.3 Obter Categoria Específica com Produtos

```bash
curl -X GET http://127.0.0.1:3333/api/categories/1 \
  -H "Authorization: Bearer {seu_token}"
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "name": "Eletrônicos",
  "description": "Produtos eletrônicos diversos",
  "createdAt": "2026-01-20T14:40:17.000-03:00",
  "updatedAt": "2026-01-20T14:40:17.000-03:00",
  "products": [
    {
      "id": 1,
      "name": "Notebook Dell",
      "price": "3500.00",
      "stockQuantity": 5
    }
  ]
}
```

### 2.4 Atualizar Categoria

```bash
curl -X PATCH http://127.0.0.1:3333/api/categories/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu_token}" \
  -d '{
    "name": "Eletrônicos Premium",
    "description": "Produtos eletrônicos de alta qualidade"
  }'
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "name": "Eletrônicos Premium",
  "description": "Produtos eletrônicos de alta qualidade",
  "createdAt": "2026-01-20T14:40:17.000-03:00",
  "updatedAt": "2026-01-20T14:40:50.000-03:00"
}
```

### 2.5 Deletar Categoria

```bash
curl -X DELETE http://127.0.0.1:3333/api/categories/1 \
  -H "Authorization: Bearer {seu_token}"
```

**Resposta (204 No Content)**

⚠️ **Nota:** Ao deletar uma categoria, todos os produtos relacionados também serão deletados (CASCADE).

---

## 🛍️ 3. PRODUTOS

Gerenciar produtos do estoque.

### 3.1 Criar Produto

```bash
curl -X POST http://127.0.0.1:3333/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu_token}" \
  -d '{
    "name": "Notebook Dell XPS 13",
    "description": "Notebook de alta performance",
    "price": 3500.00,
    "stock_quantity": 10,
    "minimum_stock": 3,
    "categoryId": 1
  }'
```

**Resposta (201 Created):**
```json
{
  "id": 1,
  "name": "Notebook Dell XPS 13",
  "description": "Notebook de alta performance",
  "price": "3500.00",
  "stockQuantity": 10,
  "minimumStock": 3,
  "categoryId": 1,
  "createdAt": "2026-01-20T14:40:38.439-03:00",
  "updatedAt": "2026-01-20T14:40:38.439-03:00"
}
```

**Validações:**
- ✅ Nome obrigatório
- ✅ Preço obrigatório (deve ser positivo)
- ✅ CategoryId obrigatório (deve existir)
- ✅ stock_quantity default 0
- ✅ minimum_stock default 0

### 3.2 Listar Produtos

```bash
curl -X GET http://127.0.0.1:3333/api/products \
  -H "Authorization: Bearer {seu_token}"
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Notebook Dell XPS 13",
    "description": "Notebook de alta performance",
    "price": "3500.00",
    "stockQuantity": 10,
    "minimumStock": 3,
    "categoryId": 1,
    "createdAt": "2026-01-20T14:40:38.000-03:00",
    "updatedAt": "2026-01-20T14:40:38.000-03:00"
  }
]
```

### 3.3 Obter Produto com Detalhes Completos

```bash
curl -X GET http://127.0.0.1:3333/api/products/1 \
  -H "Authorization: Bearer {seu_token}"
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "name": "Notebook Dell XPS 13",
  "description": "Notebook de alta performance",
  "price": "3500.00",
  "stockQuantity": 5,
  "minimumStock": 3,
  "categoryId": 1,
  "createdAt": "2026-01-20T14:40:38.000-03:00",
  "updatedAt": "2026-01-20T14:41:21.000-03:00",
  "category": {
    "id": 1,
    "name": "Eletrônicos",
    "description": "Produtos eletrônicos diversos"
  },
  "stockMovements": [
    {
      "id": 1,
      "type": "entrada",
      "quantity": 5,
      "movementDate": "2026-01-20T14:41:21.381-03:00"
    }
  ],
  "alerts": [
    {
      "id": 1,
      "alertType": "estoque_baixo",
      "message": "Produto com estoque baixo"
    }
  ]
}
```

### 3.4 Atualizar Produto

```bash
curl -X PATCH http://127.0.0.1:3333/api/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu_token}" \
  -d '{
    "name": "Notebook Dell XPS 15",
    "price": 4500.00,
    "minimum_stock": 5
  }'
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "name": "Notebook Dell XPS 15",
  "description": "Notebook de alta performance",
  "price": "4500.00",
  "stockQuantity": 5,
  "minimumStock": 5,
  "categoryId": 1,
  "createdAt": "2026-01-20T14:40:38.000-03:00",
  "updatedAt": "2026-01-20T14:42:00.000-03:00"
}
```

### 3.5 Atualizar Estoque Manualmente

Se quiser apenas ajustar o estoque sem registrar uma movimentação formal:

```bash
curl -X PATCH http://127.0.0.1:3333/api/products/1/stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu_token}" \
  -d '{
    "quantity": 15
  }'
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "name": "Notebook Dell XPS 15",
  "stockQuantity": 15,
  "message": "Estoque atualizado com sucesso"
}
```

### 3.6 Deletar Produto

```bash
curl -X DELETE http://127.0.0.1:3333/api/products/1 \
  -H "Authorization: Bearer {seu_token}"
```

**Resposta (204 No Content)**

---

## 📊 4. MOVIMENTAÇÕES DE ESTOQUE

Registrar entradas e saídas de produtos.

### 4.1 Registrar Entrada de Estoque

```bash
curl -X POST http://127.0.0.1:3333/api/stock-movements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu_token}" \
  -d '{
    "productId": 1,
    "type": "entrada",
    "quantity": 10,
    "movementDate": "2026-01-20T14:41:21.381-03:00"
  }'
```

**Resposta (201 Created):**
```json
{
  "id": 1,
  "productId": 1,
  "userId": 1,
  "type": "entrada",
  "quantity": 10,
  "movementDate": "2026-01-20T14:41:21.381-03:00",
  "createdAt": "2026-01-20T14:41:21.382-03:00",
  "product": {
    "id": 1,
    "name": "Notebook Dell XPS 13",
    "stockQuantity": 10
  },
  "user": {
    "id": 1,
    "name": "João Silva"
  }
}
```

### 4.2 Registrar Saída de Estoque

```bash
curl -X POST http://127.0.0.1:3333/api/stock-movements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu_token}" \
  -d '{
    "productId": 1,
    "type": "saida",
    "quantity": 3,
    "movementDate": "2026-01-20T14:42:00.000-03:00"
  }'
```

**Validação Automática:**
- ✅ Se quantidade > estoque disponível: **Erro 422**
- ✅ Estoque é atualizado automaticamente
- ✅ Alertas são gerados automaticamente se estoque ≤ mínimo

**Resposta de erro (422 Unprocessable Entity):**
```json
{
  "message": "Quantidade insuficiente em estoque"
}
```

**Resposta sucesso (201 Created):**
```json
{
  "id": 2,
  "productId": 1,
  "userId": 1,
  "type": "saida",
  "quantity": 3,
  "movementDate": "2026-01-20T14:42:00.000-03:00",
  "createdAt": "2026-01-20T14:42:01.000-03:00",
  "product": {
    "id": 1,
    "name": "Notebook Dell XPS 13",
    "stockQuantity": 7
  }
}
```

### 4.3 Listar Movimentações

```bash
curl -X GET http://127.0.0.1:3333/api/stock-movements \
  -H "Authorization: Bearer {seu_token}"
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "productId": 1,
    "userId": 1,
    "type": "entrada",
    "quantity": 10,
    "movementDate": "2026-01-20T14:41:21.381-03:00",
    "createdAt": "2026-01-20T14:41:21.382-03:00"
  },
  {
    "id": 2,
    "productId": 1,
    "userId": 1,
    "type": "saida",
    "quantity": 3,
    "movementDate": "2026-01-20T14:42:00.000-03:00",
    "createdAt": "2026-01-20T14:42:01.000-03:00"
  }
]
```

### 4.4 Obter Movimentação Específica

```bash
curl -X GET http://127.0.0.1:3333/api/stock-movements/1 \
  -H "Authorization: Bearer {seu_token}"
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "productId": 1,
  "userId": 1,
  "type": "entrada",
  "quantity": 10,
  "movementDate": "2026-01-20T14:41:21.381-03:00",
  "createdAt": "2026-01-20T14:41:21.382-03:00",
  "product": {
    "id": 1,
    "name": "Notebook Dell XPS 13",
    "price": "3500.00",
    "stockQuantity": 7
  },
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

### 4.5 Listar Movimentações de um Produto

```bash
curl -X GET "http://127.0.0.1:3333/api/stock-movements/product/1" \
  -H "Authorization: Bearer {seu_token}"
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "productId": 1,
    "type": "entrada",
    "quantity": 10,
    "movementDate": "2026-01-20T14:41:21.381-03:00"
  },
  {
    "id": 2,
    "productId": 1,
    "type": "saida",
    "quantity": 3,
    "movementDate": "2026-01-20T14:42:00.000-03:00"
  }
]
```

---

## ⚠️ 5. ALERTAS

Gerenciar alertas de estoque.

### 5.1 Criar Alerta Manual

```bash
curl -X POST http://127.0.0.1:3333/api/alerts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu_token}" \
  -d '{
    "productId": 1,
    "alertType": "estoque_baixo",
    "message": "Produto com estoque abaixo do mínimo"
  }'
```

**Resposta (201 Created):**
```json
{
  "id": 1,
  "productId": 1,
  "alertType": "estoque_baixo",
  "message": "Produto com estoque abaixo do mínimo",
  "isRead": false,
  "createdAt": "2026-01-20T14:41:55.028-03:00",
  "product": {
    "id": 1,
    "name": "Notebook Dell XPS 13"
  }
}
```

**Tipos de Alertas:**
- `estoque_baixo` - Estoque abaixo do mínimo
- `fora_estoque` - Produto sem estoque
- `outro` - Outro tipo de alerta

### 5.2 Listar Todos os Alertas

```bash
curl -X GET http://127.0.0.1:3333/api/alerts \
  -H "Authorization: Bearer {seu_token}"
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "productId": 1,
    "alertType": "estoque_baixo",
    "message": "Produto com estoque abaixo do mínimo",
    "isRead": false,
    "createdAt": "2026-01-20T14:41:55.028-03:00"
  }
]
```

### 5.3 Listar Apenas Alertas Não Lidos

```bash
curl -X GET http://127.0.0.1:3333/api/alerts/unread/list \
  -H "Authorization: Bearer {seu_token}"
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "productId": 1,
    "alertType": "estoque_baixo",
    "message": "Produto com estoque abaixo do mínimo",
    "isRead": false,
    "createdAt": "2026-01-20T14:41:55.028-03:00"
  }
]
```

### 5.4 Obter Alerta Específico

```bash
curl -X GET http://127.0.0.1:3333/api/alerts/1 \
  -H "Authorization: Bearer {seu_token}"
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "productId": 1,
  "alertType": "estoque_baixo",
  "message": "Produto com estoque abaixo do mínimo",
  "isRead": false,
  "createdAt": "2026-01-20T14:41:55.028-03:00",
  "product": {
    "id": 1,
    "name": "Notebook Dell XPS 13",
    "stockQuantity": 2,
    "minimumStock": 3
  }
}
```

### 5.5 Marcar Alerta como Lido

```bash
curl -X PATCH http://127.0.0.1:3333/api/alerts/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu_token}" \
  -d '{
    "isRead": true
  }'
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "productId": 1,
  "alertType": "estoque_baixo",
  "message": "Produto com estoque abaixo do mínimo",
  "isRead": true,
  "createdAt": "2026-01-20T14:41:55.028-03:00"
}
```

### 5.6 Marcar Todos os Alertas como Lidos

```bash
curl -X PATCH http://127.0.0.1:3333/api/alerts/all/mark-read \
  -H "Authorization: Bearer {seu_token}"
```

**Resposta (200 OK):**
```json
{
  "message": "Todos os alertas foram marcados como lidos"
}
```

### 5.7 Deletar Alerta

```bash
curl -git push -u origin mainX DELETE http://127.0.0.1:3333/api/alerts/1 \
  -H "Authorization: Bearer {seu_token}"
```

**Resposta (204 No Content)**

---

## 👥 6. USUÁRIOS (Admin)

Gerenciar usuários do sistema.

### 6.1 Listar Usuários

```bash
curl -X GET http://127.0.0.1:3333/api/users \
  -H "Authorization: Bearer {seu_token}"
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "user",
    "createdAt": "2026-01-20T14:39:55.000-03:00",
    "updatedAt": "2026-01-20T14:39:55.000-03:00"
  }
]
```

### 6.2 Obter Usuário Específico

```bash
curl -X GET http://127.0.0.1:3333/api/users/1 \
  -H "Authorization: Bearer {seu_token}"
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "user",
  "createdAt": "2026-01-20T14:39:55.000-03:00",
  "updatedAt": "2026-01-20T14:39:55.000-03:00"
}
```

### 6.3 Atualizar Usuário

```bash
curl -X PATCH http://127.0.0.1:3333/api/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {seu_token}" \
  -d '{
    "name": "João Silva Santos",
    "role": "admin"
  }'
```

**Resposta (200 OK):**
```json
{
  "id": 1,
  "name": "João Silva Santos",
  "email": "joao@example.com",
  "role": "admin",
  "createdAt": "2026-01-20T14:39:55.000-03:00",
  "updatedAt": "2026-01-20T14:43:00.000-03:00"
}
```

### 6.4 Deletar Usuário

```bash
curl -X DELETE http://127.0.0.1:3333/api/users/1 \
  -H "Authorization: Bearer {seu_token}"
```

**Resposta (204 No Content)**

---

## 🛠️ FLUXO COMPLETO - Exemplo Prático

Vamos criar um cenário completo de uso:

### Passo 1: Registrar Usuário e Fazer Login

```bash
# Registrar
TOKEN=$(curl -s -X POST http://127.0.0.1:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Estoque",
    "email": "admin@estoque.com",
    "password": "admin123456"
  }' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"
```

### Passo 2: Criar Categoria

```bash
curl -X POST http://127.0.0.1:3333/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Informática",
    "description": "Produtos de informática"
  }'
```

### Passo 3: Criar Produto

```bash
curl -X POST http://127.0.0.1:3333/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Monitor LG 24\"",
    "description": "Monitor Full HD",
    "price": 800.00,
    "stock_quantity": 5,
    "minimum_stock": 2,
    "categoryId": 1
  }'
```

### Passo 4: Registrar Entrada de Estoque

```bash
curl -X POST http://127.0.0.1:3333/api/stock-movements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "productId": 1,
    "type": "entrada",
    "quantity": 20
  }'
```

### Passo 5: Registrar Saída de Estoque

```bash
curl -X POST http://127.0.0.1:3333/api/stock-movements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "productId": 1,
    "type": "saida",
    "quantity": 10
  }'
```

### Passo 6: Verificar Alertas

```bash
curl -X GET http://127.0.0.1:3333/api/alerts \
  -H "Authorization: Bearer $TOKEN"
```

### Passo 7: Marcar Alertas como Lidos

```bash
curl -X PATCH http://127.0.0.1:3333/api/alerts/all/mark-read \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📋 Tabela de Referência Rápida

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| **AUTH** |
| POST | `/api/auth/register` | Registrar novo usuário |
| POST | `/api/auth/login` | Fazer login |
| GET | `/api/auth/me` | Dados do usuário autenticado |
| POST | `/api/auth/logout` | Logout |
| **CATEGORIAS** |
| GET | `/api/categories` | Listar categorias |
| POST | `/api/categories` | Criar categoria |
| GET | `/api/categories/:id` | Obter categoria com produtos |
| PATCH | `/api/categories/:id` | Atualizar categoria |
| DELETE | `/api/categories/:id` | Deletar categoria |
| **PRODUTOS** |
| GET | `/api/products` | Listar produtos |
| POST | `/api/products` | Criar produto |
| GET | `/api/products/:id` | Obter produto com detalhes |
| PATCH | `/api/products/:id` | Atualizar produto |
| PATCH | `/api/products/:id/stock` | Atualizar estoque |
| DELETE | `/api/products/:id` | Deletar produto |
| **MOVIMENTAÇÕES** |
| GET | `/api/stock-movements` | Listar movimentações |
| POST | `/api/stock-movements` | Registrar movimentação |
| GET | `/api/stock-movements/:id` | Obter movimentação |
| GET | `/api/stock-movements/product/:productId` | Movimentações de um produto |
| **ALERTAS** |
| GET | `/api/alerts` | Listar alertas |
| POST | `/api/alerts` | Criar alerta |
| GET | `/api/alerts/:id` | Obter alerta |
| GET | `/api/alerts/unread/list` | Listar não lidos |
| PATCH | `/api/alerts/:id` | Marcar como lido |
| PATCH | `/api/alerts/all/mark-read` | Marcar todos como lidos |
| DELETE | `/api/alerts/:id` | Deletar alerta |
| **USUÁRIOS** |
| GET | `/api/users` | Listar usuários |
| POST | `/api/users` | Criar usuário (admin) |
| GET | `/api/users/:id` | Obter usuário |
| PATCH | `/api/users/:id` | Atualizar usuário |
| DELETE | `/api/users/:id` | Deletar usuário |

---

## ❌ Códigos de Erro Comuns

| Código | Significado | Solução |
|--------|-----------|---------|
| 400 | Bad Request | Verifique os dados enviados |
| 401 | Unauthorized | Token inválido ou ausente |
| 404 | Not Found | Recurso não encontrado |
| 422 | Unprocessable Entity | Validação falhou (veja o erro) |
| 500 | Internal Server Error | Erro no servidor |

---

## 💡 Dicas Importantes

1. **Token**: Sempre inclua o Bearer token nos headers (exceto em /auth/register e /auth/login)
2. **CamelCase vs snake_case**: Use camelCase na requisição (categoryId) mas a resposta pode usar snake_case em alguns campos
3. **Alertas Automáticos**: Ao registrar uma saída que deixa o estoque ≤ mínimo, um alerta é criado automaticamente
4. **Cascata**: Deletar uma categoria deleta todos seus produtos
5. **Timestamps**: Todos os registros têm createdAt e updatedAt automáticos
6. **Usuário Rastreado**: Cada movimentação registra qual usuário fez a operação

---

## 🧪 Testando com Insomnia ou Postman

1. **Importe os exemplos acima**
2. **Crie uma variável de ambiente**: `token` = seu token
3. **Use nos headers**: `Authorization: Bearer {{token}}`
4. **Teste cada endpoint**

---

**Projeto desenvolvido com AdonisJS v6** 🚀
