import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';
import fs from 'fs/promises';
import path from 'path';
router.get('/', async ({ response }) => {
    try {
        const filePath = path.join(import.meta.url.replace('file://', ''), '../../public/index.html');
        const content = await fs.readFile(filePath.replace('start/routes.ts', 'public/index.html'), 'utf-8');
        return response.header('Content-Type', 'text/html').send(content);
    }
    catch (error) {
        return response.send('<h1>Testador Visual</h1><p>Abra a página inicial no navegador</p>');
    }
});
router.get('/api-docs', '#controllers/documentation_controller.index');
router.group(() => {
    router.post('/register', '#controllers/auth_controller.register');
    router.post('/login', '#controllers/auth_controller.login');
}).prefix('/api/auth');
router.group(() => {
    router.group(() => {
        router.get('/me', '#controllers/auth_controller.me');
        router.post('/logout', '#controllers/auth_controller.logout');
    }).prefix('/auth');
    router.group(() => {
        router.get('/', '#controllers/users_controller.index');
        router.get('/:id', '#controllers/users_controller.show');
        router.patch('/:id', '#controllers/users_controller.update');
        router.delete('/:id', '#controllers/users_controller.destroy');
    }).prefix('/users');
    router.group(() => {
        router.get('/', '#controllers/categories_controller.index');
        router.post('/', '#controllers/categories_controller.store');
        router.get('/:id', '#controllers/categories_controller.show');
        router.patch('/:id', '#controllers/categories_controller.update');
        router.delete('/:id', '#controllers/categories_controller.destroy');
    }).prefix('/categories');
    router.group(() => {
        router.get('/', '#controllers/products_controller.index');
        router.post('/', '#controllers/products_controller.store');
        router.get('/:id', '#controllers/products_controller.show');
        router.patch('/:id', '#controllers/products_controller.update');
        router.patch('/:id/stock', '#controllers/products_controller.updateStock');
        router.delete('/:id', '#controllers/products_controller.destroy');
    }).prefix('/products');
    router.group(() => {
        router.get('/', '#controllers/stock_movements_controller.index');
        router.post('/', '#controllers/stock_movements_controller.store');
        router.get('/:id', '#controllers/stock_movements_controller.show');
        router.get('/product/:productId', '#controllers/stock_movements_controller.byProduct');
    }).prefix('/stock-movements');
    router.group(() => {
        router.get('/', '#controllers/alerts_controller.index');
        router.post('/', '#controllers/alerts_controller.store');
        router.get('/:id', '#controllers/alerts_controller.show');
        router.patch('/:id/read', '#controllers/alerts_controller.markAsRead');
        router.delete('/:id', '#controllers/alerts_controller.destroy');
        router.get('/unread/list', '#controllers/alerts_controller.unread');
        router.patch('/all/mark-read', '#controllers/alerts_controller.markAllAsRead');
    }).prefix('/alerts');
}).prefix('/api').use(middleware.auth());
//# sourceMappingURL=routes.js.map