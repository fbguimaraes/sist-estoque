import vine from '@vinejs/vine';
export const createStockMovementValidator = vine.compile(vine.object({
    productId: vine.number().positive(),
    type: vine.enum(['entrada', 'saida']),
    quantity: vine.number().positive(),
    movementDate: vine.date().optional(),
}));
//# sourceMappingURL=stock_movement.js.map