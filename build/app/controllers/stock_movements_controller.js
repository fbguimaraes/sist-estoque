import { DateTime } from 'luxon';
import StockMovement from '#models/stock_movement';
import Product from '#models/product';
import Alert from '#models/alert';
import { createStockMovementValidator } from '#validators/stock_movement';
export default class StockMovementsController {
    async index({ response }) {
        const movements = await StockMovement.query().preload('product').preload('user');
        return response.ok(movements);
    }
    async store({ request, response, auth }) {
        const data = await createStockMovementValidator.validate(request.all());
        const user = auth.use('api').user;
        const product = await Product.findOrFail(data.productId);
        if (data.type === 'entrada') {
            product.stockQuantity += data.quantity;
        }
        else {
            if (product.stockQuantity < data.quantity) {
                return response.badRequest({
                    message: 'Quantidade insuficiente em estoque',
                });
            }
            product.stockQuantity -= data.quantity;
        }
        await product.save();
        const movement = await StockMovement.create({
            productId: data.productId,
            userId: user.id,
            type: data.type,
            quantity: data.quantity,
            movementDate: data.movementDate ? DateTime.fromISO(String(data.movementDate)) : DateTime.now(),
        });
        if (product.stockQuantity <= product.minimumStock) {
            const alertType = product.stockQuantity === 0 ? 'fora_estoque' : 'estoque_baixo';
            const message = `${product.name}: ${alertType === 'fora_estoque' ? 'Produto fora de estoque' : 'Estoque abaixo do mínimo'}`;
            await Alert.create({
                productId: product.id,
                alertType,
                message,
                isRead: false,
            });
        }
        await movement.load('product');
        await movement.load('user');
        return response.created(movement);
    }
    async show({ params, response }) {
        const movement = await StockMovement.query()
            .where('id', params.id)
            .preload('product')
            .preload('user')
            .firstOrFail();
        return response.ok(movement);
    }
    async byProduct({ params, response }) {
        const movements = await StockMovement.query()
            .where('product_id', params.productId)
            .preload('user');
        return response.ok(movements);
    }
}
//# sourceMappingURL=stock_movements_controller.js.map