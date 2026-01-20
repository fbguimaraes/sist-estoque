import vine from '@vinejs/vine';
export const createAlertValidator = vine.compile(vine.object({
    productId: vine.number().positive(),
    alertType: vine.enum(['estoque_baixo', 'fora_estoque', 'outro']),
    message: vine.string().trim().minLength(3).maxLength(500),
}));
export const markAsReadValidator = vine.compile(vine.object({
    isRead: vine.boolean(),
}));
//# sourceMappingURL=alert.js.map