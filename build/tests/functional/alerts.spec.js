import { test } from '@japa/runner';
let authToken;
let productId;
test.group('Alerts', (group) => {
    group.each.setup(async ({ context }) => {
        context.client = context.client || {};
        if (!authToken) {
            const registerResponse = await context.client.post('/api/auth/register').json({
                name: 'Alert Test User',
                email: `alert-${Date.now()}@example.com`,
                password: 'password123',
            });
            authToken = registerResponse.body().token;
            const categoryResponse = await context.client
                .post('/api/categories')
                .header('Authorization', `Bearer ${authToken}`)
                .json({
                name: 'Categoria Alertas',
                description: 'Categoria para testes de alertas',
            });
            const categoryId = categoryResponse.body().id;
            const productResponse = await context.client
                .post('/api/products')
                .header('Authorization', `Bearer ${authToken}`)
                .json({
                name: 'Produto Alert Test',
                description: 'Produto para testes de alertas',
                price: 50.00,
                stockQuantity: 100,
                minimumStock: 10,
                categoryId,
            });
            productId = productResponse.body().id;
        }
    });
    test('deve listar todos os alertas', async ({ client }) => {
        const response = await client
            .get('/api/alerts')
            .header('Authorization', `Bearer ${authToken}`);
        response.assertStatus(200);
    });
    test('deve criar um novo alerta', async ({ client }) => {
        const response = await client
            .post('/api/alerts')
            .header('Authorization', `Bearer ${authToken}`)
            .json({
            productId,
            alertType: 'estoque_baixo',
            message: 'Estoque do produto está baixo',
        });
        response.assertStatus(201);
        response.assertBodyContains('estoque_baixo');
    });
    test('deve exibir um alerta específico', async ({ client }) => {
        const createResponse = await client
            .post('/api/alerts')
            .header('Authorization', `Bearer ${authToken}`)
            .json({
            productId,
            alertType: 'fora_estoque',
            message: 'Produto fora de estoque',
        });
        const alertId = createResponse.body().id;
        const response = await client
            .get(`/api/alerts/${alertId}`)
            .header('Authorization', `Bearer ${authToken}`);
        response.assertStatus(200);
        response.assertBodyContains('fora_estoque');
    });
    test('deve marcar um alerta como lido', async ({ client }) => {
        const createResponse = await client
            .post('/api/alerts')
            .header('Authorization', `Bearer ${authToken}`)
            .json({
            productId,
            alertType: 'estoque_baixo',
            message: 'Teste marcar como lido',
        });
        const alertId = createResponse.body().id;
        const response = await client
            .patch(`/api/alerts/${alertId}/read`)
            .header('Authorization', `Bearer ${authToken}`)
            .json({
            isRead: true,
        });
        response.assertStatus(200);
    });
    test('deve listar alertas não lidos', async ({ client }) => {
        const response = await client
            .get('/api/alerts/unread/list')
            .header('Authorization', `Bearer ${authToken}`);
        response.assertStatus(200);
    });
    test('deve marcar todos os alertas como lidos', async ({ client }) => {
        const response = await client
            .patch('/api/alerts/all/mark-read')
            .header('Authorization', `Bearer ${authToken}`);
        response.assertStatus(200);
    });
    test('deve deletar um alerta', async ({ client }) => {
        const createResponse = await client
            .post('/api/alerts')
            .header('Authorization', `Bearer ${authToken}`)
            .json({
            productId,
            alertType: 'outro',
            message: 'Alerta para deletar',
        });
        const alertId = createResponse.body().id;
        const response = await client
            .delete(`/api/alerts/${alertId}`)
            .header('Authorization', `Bearer ${authToken}`);
        response.assertStatus(204);
    });
});
//# sourceMappingURL=alerts.spec.js.map