# 🧪 Guia de Testes da API

Aprenda as diferentes formas de testar sua API de Gerenciamento de Estoque.

---

## 🚀 OPÇÃO 1: TESTES AUTOMATIZADOS (Recomendado)

A API já possui uma suite completa de testes com **Japa** (framework de testes do AdonisJS).

### 1.1 Executar Todos os Testes

```bash
npm run test
```

**Saída esperada:**
```
 PASS  tests/functional/auth.spec.ts (8 tests)
 PASS  tests/functional/categories.spec.ts (5 tests)
 PASS  tests/functional/products.spec.ts (6 tests)
 PASS  tests/functional/stock_movements.spec.ts (4 tests)
 PASS  tests/functional/alerts.spec.ts (5 tests)

Total: 28 tests | 28 passed | 0 failed
```

### 1.2 Executar Testes de um Arquivo Específico

```bash
# Testar apenas autenticação
npm run test -- tests/functional/auth.spec.ts

# Testar apenas categorias
npm run test -- tests/functional/categories.spec.ts

# Testar apenas produtos
npm run test -- tests/functional/products.spec.ts
```

### 1.3 Executar em Modo Watch (Auto-reload)

```bash
npm run test -- --watch
```

Quando você salvar um arquivo de teste, ele será re-executado automaticamente.

### 1.4 Ver Cobertura de Testes

```bash
npm run test -- --coverage
```

---

## 🔧 OPÇÃO 2: TESTES COM CURL (Terminal)

Teste manualmente usando curl no terminal. Ideal para entender o fluxo.

### 2.1 Inicie o Servidor

```bash
npm run dev
```

### 2.2 Teste Cada Endpoint Manualmente

#### **A. Registrar Usuário**

```bash
curl -X POST http://127.0.0.1:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste User",
    "email": "teste@example.com",
    "password": "senha123456"
  }'
```

**Resposta esperada (201):**
```json
{
  "user": {
    "id": 1,
    "name": "Teste User",
    "email": "teste@example.com",
    "role": "user"
  },
  "token": "oat_NA.UE42U0RlVG5..."
}
```

#### **B. Fazer Login**

```bash
TOKEN=$(curl -s -X POST http://127.0.0.1:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123456"
  }' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"
```

#### **C. Criar Categoria**

```bash
TOKEN="seu_token_aqui"

curl -X POST http://127.0.0.1:3333/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Eletrônicos",
    "description": "Produtos eletrônicos diversos"
  }'
```

#### **D. Criar Produto**

```bash
curl -X POST http://127.0.0.1:3333/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Monitor LG 24\"",
    "description": "Monitor Full HD",
    "price": 800.00,
    "stock_quantity": 10,
    "minimum_stock": 3,
    "categoryId": 1
  }'
```

#### **E. Registrar Entrada de Estoque**

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

#### **F. Registrar Saída de Estoque**

```bash
curl -X POST http://127.0.0.1:3333/api/stock-movements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "productId": 1,
    "type": "saida",
    "quantity": 5
  }'
```

#### **G. Listar Alertas**

```bash
curl -X GET http://127.0.0.1:3333/api/alerts \
  -H "Authorization: Bearer $TOKEN"
```

### 2.3 Script de Teste Completo

Crie um arquivo `test-api.sh`:

```bash
#!/bin/bash

API_URL="http://127.0.0.1:3333"

echo "🧪 Iniciando testes da API..."
echo ""

# 1. Registrar usuário
echo "1️⃣  Registrando novo usuário..."
RESPONSE=$(curl -s -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste User",
    "email": "teste@example.com",
    "password": "senha123456"
  }')

TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "✅ Usuário criado. Token: ${TOKEN:0:20}..."
echo ""

# 2. Criar categoria
echo "2️⃣  Criando categoria..."
curl -s -X POST $API_URL/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Eletrônicos","description":"Produtos eletrônicos"}' \
  | python3 -m json.tool | head -10
echo ""

# 3. Criar produto
echo "3️⃣  Criando produto..."
curl -s -X POST $API_URL/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Monitor LG","price":800.00,"stock_quantity":10,"minimum_stock":3,"categoryId":1}' \
  | python3 -m json.tool | head -10
echo ""

# 4. Registrar entrada
echo "4️⃣  Registrando entrada de estoque..."
curl -s -X POST $API_URL/api/stock-movements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"productId":1,"type":"entrada","quantity":20}' \
  | python3 -m json.tool | head -15
echo ""

# 5. Registrar saída
echo "5️⃣  Registrando saída de estoque..."
curl -s -X POST $API_URL/api/stock-movements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"productId":1,"type":"saida","quantity":5}' \
  | python3 -m json.tool | head -15
echo ""

# 6. Listar alertas
echo "6️⃣  Listando alertas..."
curl -s -X GET $API_URL/api/alerts \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -m json.tool | head -20
echo ""

echo "✅ Testes concluídos!"
```

**Como usar:**

```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 📮 OPÇÃO 3: INSOMNIA OU POSTMAN

Ferramentas visuais para testar endpoints.

### 3.1 Instalação

**Insomnia:**
```bash
# macOS
brew install insomnia

# Ubuntu/Debian
wget https://updates.insomnia.rest/downloads/ubuntu/latest
sudo dpkg -i insomnia-*.deb
```

**Postman:**
- Baixar em: https://www.postman.com/downloads/

### 3.2 Importar Collection de Testes

**Criar manualmente na ferramenta:**

1. **Nova Request** → POST → http://127.0.0.1:3333/api/auth/register
2. **Body** → JSON raw:
   ```json
   {
     "name": "Teste User",
     "email": "teste@example.com",
     "password": "senha123456"
   }
   ```
3. **Enviar** e copiar o token da resposta

4. **Variável de Ambiente** → Criar `token = {seu_token}`

5. **Próximas Requisições** → Header: `Authorization: Bearer {{token}}`

### 3.3 Exemplo de Collection Pronta

Copie este JSON no Postman/Insomnia como nova collection:

```json
{
  "info": {
    "name": "SistEstoque API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "http://127.0.0.1:3333/api/auth/register",
              "protocol": "http",
              "host": ["127", "0", "0", "1"],
              "port": "3333",
              "path": ["api", "auth", "register"]
            },
            "body": {
              "mode": "raw",
              "raw": "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"senha123456\"}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": {"raw": "http://127.0.0.1:3333/api/auth/login"},
            "body": {"mode": "raw", "raw": "{\"email\":\"test@example.com\",\"password\":\"senha123456\"}"}
          }
        }
      ]
    }
  ]
}
```

---

## 🎯 OPÇÃO 4: TESTE RÁPIDO COM PASSO A PASSO

Siga este passo a passo para teste rápido:

### Passo 1: Verificar se servidor está rodando

```bash
npm run dev
```

Espere pela mensagem:
```
Server address: http://127.0.0.1:3333
```

### Passo 2: Ver documentação da API

```bash
curl http://127.0.0.1:3333/ | python3 -m json.tool | head -50
```

### Passo 3: Registrar usuário

```bash
curl -X POST http://127.0.0.1:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Seu Nome",
    "email": "seu@email.com",
    "password": "senha123456"
  }' | python3 -m json.tool
```

Copie o `token` da resposta.

### Passo 4: Guardar token em variável

```bash
TOKEN="cole_seu_token_aqui"
```

### Passo 5: Testar endpoint protegido

```bash
curl -X GET http://127.0.0.1:3333/api/auth/me \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -m json.tool
```

Se retornar seus dados, **a API está funcionando!** ✅

### Passo 6: Testar fluxo completo

```bash
# Criar categoria
curl -X POST http://127.0.0.1:3333/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Teste","description":"Categoria de teste"}' \
  | python3 -m json.tool

# Criar produto
curl -X POST http://127.0.0.1:3333/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Produto Teste","price":100.00,"stock_quantity":10,"minimum_stock":2,"categoryId":1}' \
  | python3 -m json.tool

# Registrar movimento
curl -X POST http://127.0.0.1:3333/api/stock-movements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"productId":1,"type":"saida","quantity":5}' \
  | python3 -m json.tool

# Ver alertas
curl -X GET http://127.0.0.1:3333/api/alerts \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -m json.tool
```

---

## 📊 OPÇÃO 5: TESTES DE CARGA

Teste a performance com muitas requisições.

### 5.1 Com Apache Bench

```bash
# Instalar
sudo apt-get install apache2-utils

# Teste de 1000 requisições com concorrência de 10
ab -n 1000 -c 10 http://127.0.0.1:3333/
```

### 5.2 Com wrk

```bash
# Instalar
git clone https://github.com/wg/wrk.git
cd wrk
make

# Teste por 30 segundos com 4 threads e 100 conexões
./wrk -t4 -c100 -d30s http://127.0.0.1:3333/
```

---

## 🔍 OPÇÃO 6: VALIDAR ERROS

Teste como a API lida com erros.

### 6.1 Teste de Validação

```bash
# Email inválido
curl -X POST http://127.0.0.1:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"invalido","password":"123"}'

# Resposta esperada (422):
# {
#   "errors": [{"message": "email is required", "rule": "required"}]
# }
```

### 6.2 Teste de Autenticação

```bash
# Sem token
curl -X GET http://127.0.0.1:3333/api/categories

# Resposta esperada (401):
# {"message": "Unauthorized"}
```

### 6.3 Teste de Não Encontrado

```bash
TOKEN="seu_token"

# ID que não existe
curl -X GET http://127.0.0.1:3333/api/products/99999 \
  -H "Authorization: Bearer $TOKEN"

# Resposta esperada (404):
# {"message": "Produto não encontrado"}
```

---

## 📈 MATRIZ DE TESTES RECOMENDADA

| Teste | Comando | Esperado |
|-------|---------|----------|
| **GET /** | `curl http://127.0.0.1:3333/` | 200 + JSON |
| **Register** | `POST /api/auth/register` | 201 + token |
| **Login** | `POST /api/auth/login` | 201 + token |
| **Me** | `GET /api/auth/me` (com token) | 200 + user |
| **Categories** | `GET /api/categories` (com token) | 200 + array |
| **Create Category** | `POST /api/categories` | 201 |
| **Create Product** | `POST /api/products` | 201 |
| **Stock Movement** | `POST /api/stock-movements` | 201 |
| **Saída > Estoque** | `POST /api/stock-movements` (saida) | 422 |
| **Alertas** | `GET /api/alerts` | 200 |
| **Sem Token** | `GET /api/categories` | 401 |
| **ID Inválido** | `GET /api/products/99999` | 404 |

---

## ✅ CHECKLIST DE TESTES

- [ ] Servidor inicia sem erros (`npm run dev`)
- [ ] GET / retorna documentação
- [ ] Registro de usuário funciona
- [ ] Login gera token válido
- [ ] GET /auth/me retorna usuário
- [ ] Endpoints sem token retornam 401
- [ ] Criar categoria funciona
- [ ] Criar produto funciona
- [ ] Estoque é atualizado automaticamente
- [ ] Alertas são criados quando necessário
- [ ] Validações rejeitam dados inválidos
- [ ] Deletar categoria deleta produtos
- [ ] Testes automatizados passam: `npm run test`

---

## 🐛 TROUBLESHOOTING

### Servidor não inicia?

```bash
# Verifique se a porta 3333 está em uso
lsof -i :3333

# Se estiver, mate o processo
kill -9 <PID>

# Reinicie
npm run dev
```

### Token inválido?

```bash
# Regenere um novo token fazendo login novamente
curl -X POST http://127.0.0.1:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","password":"senha123456"}'
```

### Erro de banco de dados?

```bash
# Verifique se MySQL está rodando
mysql -u root -p -e "SELECT 1"

# Se não, inicie
sudo service mysql start
```

### Testar sem python3?

```bash
# Sem json.tool, saída bruta
curl http://127.0.0.1:3333/

# Com jq (se instalado)
curl http://127.0.0.1:3333/ | jq .
```

---

## 🎓 Próximos Passos

1. ✅ Rode `npm run test` para passar em todos os testes
2. ✅ Teste manualmente com curl para entender o fluxo
3. ✅ Configure Postman/Insomnia para testes visuais
4. ✅ Valide casos de erro
5. ✅ Teste a performance com wrk
6. ✅ Deploy em produção

---

**Qualquer dúvida, consulte GUIA_PRATICO.md para exemplos detalhados!** 📖
