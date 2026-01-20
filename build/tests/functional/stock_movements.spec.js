import { test } from '@japa/runner';
let authToken;
let categoryId;
let productId;
test.group('Stock Movements', (group) => {
    group.each.setup(async ({ context }) => {
        context.client = context.client || {};
        if (!authToken) {
            const registerResponse = await context.client.post('/api/auth/register').json({
                name: 'Stock Movement Test User',
                email: `stock-${Date.now()}@example.com`,
                password: 'password123',
            });
            authToken = registerResponse.body().token;
            const categoryResponse = await context.client
                .post('/api/categories')
                .header('Authorization', `Bearer ${authToken}`)
                .json({
                name: 'Categoria Stock',
                description: 'Categoria para testes de estoque',
            });
            categoryId = categoryResponse.body().id;
            const productResponse = await context.client
                .post('/api/products')
                .header('Authorization', `Bearer ${authToken}`)
                .json({
                name: 'Produto Stock Test',
                description: 'Produto para testes de movimentação',
                price: 100.00,
                stockQuantity: 50,
                minimumStock: 5,
                categoryId,
            });
            productId = productResponse.body().id;
        }
    });
    test('deve listar todas as movimentações', async ({ client }) => {
        const response = await client
            .get('/api/stock-movements')
            .header('Authorization', `Bearer ${authToken}`);
        response.assertStatus(200);
    });
    test('deve registrar entrada de estoque', async ({ client }) => {
        const response = await client
            .post('/api/stock-movements')
            .header('Authorization', `Bearer ${authToken}`)
            .json({
            productId,
            type: 'entrada',
            quantity: 10,
        });
        response.assertStatus(201);
        response.assertBodyContains('entrada');
    });
    test('deve registrar saída de estoque', async ({ client }) => {
        const response = await client
            .post('/api/stock-movements')
            .header('Authorization', `Bearer ${authToken}`)
            .json({
            productId,
            type: 'saida',
            quantity: 5,
        });
        response.assertStatus(201);
        response.assertBodyContains('saida');
    });
    test('deve retornar erro ao tentar saída maior que estoque', async ({ client }) => {
        const response = await client
            .post('/api/stock-movements')
            .header('Authorization', `Bearer ${authToken}`)
            .json({
            productId,
            type: 'saida',
            quantity: 10000,
        });
        response.assertStatus(400);
    });
    test('deve exibir uma movimentação específica', async ({ client }) => {
        const createResponse = await client
            .post('/api/stock-movements')
            .header('Authorization', `Bearer ${authToken}`)
            .json({
            productId,
            type: 'entrada',
            quantity: 20,
        });
        const movementId = createResponse.body().id;
        const response = await client
            .get(`/api/stock-movements/${movementId}`)
            .header('Authorization', `Bearer ${authToken}`);
        response.assertStatus(200);
    });
    test('deve listar movimentações por produto', async ({ client }) => {
        const response = await client
            .get(`/api/stock-movements/product/${productId}`)
            .header('Authorization', `Bearer ${authToken}`);
        response.assertStatus(200);
    });
});
//# sourceMappingURL=stock_movements.spec.js.map