import Alert from '#models/alert';
export default class AlertService {
    static async checkAndCreateAlert(product) {
        const existingAlert = await Alert.query()
            .where('product_id', product.id)
            .where('is_read', false)
            .first();
        if (existingAlert) {
            return existingAlert;
        }
        let alertType;
        let message;
        if (product.stockQuantity === 0) {
            alertType = 'fora_estoque';
            message = `Produto "${product.name}" está FORA DE ESTOQUE`;
        }
        else if (product.stockQuantity <= product.minimumStock) {
            alertType = 'estoque_baixo';
            message = `Produto "${product.name}" tem estoque abaixo do mínimo (${product.stockQuantity}/${product.minimumStock})`;
        }
        else {
            return null;
        }
        const alert = await Alert.create({
            productId: product.id,
            alertType,
            message,
            isRead: false,
        });
        return alert;
    }
    static async markAsRead(alertId) {
        const alert = await Alert.findOrFail(alertId);
        alert.isRead = true;
        await alert.save();
        return alert;
    }
    static async getActiveAlerts() {
        return await Alert.query().where('is_read', false).preload('product');
    }
    static async getAlertsByType(alertType) {
        return await Alert.query()
            .where('alert_type', alertType)
            .where('is_read', false)
            .preload('product');
    }
}
//# sourceMappingURL=alert_service.js.map