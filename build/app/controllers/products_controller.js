import Product from '#models/product';
import { createProductValidator, updateStockValidator } from '#validators/product';
export default class ProductsController {
    async index({ response }) {
        const products = await Product.query().preload('category');
        return response.ok(products);
    }
    async store({ request, response }) {
        const data = await createProductValidator.validate(request.all());
        const product = await Product.create(data);
        return response.created(product);
    }
    async show({ params, response }) {
        const product = await Product.query()
            .where('id', params.id)
            .preload('category')
            .preload('stockMovements')
            .preload('alerts')
            .firstOrFail();
        return response.ok(product);
    }
    async update({ params, request, response }) {
        const product = await Product.findOrFail(params.id);
        const data = await createProductValidator.validate(request.all());
        await product.merge(data).save();
        return response.ok(product);
    }
    async destroy({ params, response }) {
        const product = await Product.findOrFail(params.id);
        await product.delete();
        return response.noContent();
    }
    async updateStock({ params, request, response }) {
        const product = await Product.findOrFail(params.id);
        const data = await updateStockValidator.validate(request.all());
        await product.merge(data).save();
        return response.ok(product);
    }
}
//# sourceMappingURL=products_controller.js.map