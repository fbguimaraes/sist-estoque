import Alert from '#models/alert';
import { createAlertValidator, markAsReadValidator } from '#validators/alert';
export default class AlertsController {
    async index({ response }) {
        const alerts = await Alert.query().preload('product');
        return response.ok(alerts);
    }
    async store({ request, response }) {
        const data = await createAlertValidator.validate(request.all());
        const alert = await Alert.create(data);
        await alert.load('product');
        return response.created(alert);
    }
    async show({ params, response }) {
        const alert = await Alert.query().where('id', params.id).preload('product').firstOrFail();
        return response.ok(alert);
    }
    async markAsRead({ params, request, response }) {
        const alert = await Alert.findOrFail(params.id);
        const data = await markAsReadValidator.validate(request.all());
        await alert.merge(data).save();
        return response.ok(alert);
    }
    async destroy({ params, response }) {
        const alert = await Alert.findOrFail(params.id);
        await alert.delete();
        return response.noContent();
    }
    async unread({ response }) {
        const alerts = await Alert.query().where('is_read', false).preload('product');
        return response.ok(alerts);
    }
    async markAllAsRead({ response }) {
        await Alert.query().where('is_read', false).update({ isRead: true });
        return response.ok({ message: 'Todos os alertas marcados como lidos' });
    }
}
//# sourceMappingURL=alerts_controller.js.map