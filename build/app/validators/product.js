import vine from '@vinejs/vine';
export const createProductValidator = vine.compile(vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    description: vine.string().trim().maxLength(1000).optional(),
    price: vine.number().positive(),
    stockQuantity: vine.number().min(0).optional(),
    minimumStock: vine.number().min(0).optional(),
    categoryId: vine.number().positive(),
}));
export const updateStockValidator = vine.compile(vine.object({
    stockQuantity: vine.number().min(0),
}));
//# sourceMappingURL=product.js.map