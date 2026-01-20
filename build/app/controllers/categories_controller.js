import Category from '#models/category';
import { createCategoryValidator } from '#validators/category';
export default class CategoriesController {
    async index({ response }) {
        const categories = await Category.all();
        return response.ok(categories);
    }
    async store({ request, response }) {
        const data = await createCategoryValidator.validate(request.all());
        const category = await Category.create(data);
        return response.created(category);
    }
    async show({ params, response }) {
        const category = await Category.query().where('id', params.id).preload('products').firstOrFail();
        return response.ok(category);
    }
    async update({ params, request, response }) {
        const category = await Category.findOrFail(params.id);
        const data = await createCategoryValidator.validate(request.all());
        await category.merge(data).save();
        return response.ok(category);
    }
    async destroy({ params, response }) {
        const category = await Category.findOrFail(params.id);
        await category.delete();
        return response.noContent();
    }
}
//# sourceMappingURL=categories_controller.js.map