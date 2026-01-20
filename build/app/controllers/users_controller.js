import User from '#models/user';
export default class UsersController {
    async index({ response }) {
        const users = await User.all();
        return response.ok(users);
    }
    async show({ params, response }) {
        const user = await User.findOrFail(params.id);
        return response.ok(user);
    }
    async update({ params, request, response }) {
        const user = await User.findOrFail(params.id);
        const data = request.only(['name', 'role']);
        await user.merge(data).save();
        return response.ok(user);
    }
    async destroy({ params, response }) {
        const user = await User.findOrFail(params.id);
        await user.delete();
        return response.noContent();
    }
}
//# sourceMappingURL=users_controller.js.map