/**
 * Validadores para movimentações de estoque
 * 
 * @description Define validações para operações com movimentações
 * @author Sistema
 */
import vine from '@vinejs/vine'

/**
 * Validador para criar movimentação de estoque
 */
export const createStockMovementValidator = vine.compile(
  vine.object({
    productId: vine.number().positive(),
    type: vine.enum(['entrada', 'saida']),
    quantity: vine.number().positive(),
    movementDate: vine.date().optional(),
  })
)
