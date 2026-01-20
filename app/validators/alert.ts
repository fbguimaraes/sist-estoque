/**
 * Validadores para alertas
 * 
 * @description Define validações para operações com alertas
 * @author Sistema
 */
import vine from '@vinejs/vine'

/**
 * Validador para criar alerta
 */
export const createAlertValidator = vine.compile(
  vine.object({
    productId: vine.number().positive(),
    alertType: vine.enum(['estoque_baixo', 'fora_estoque', 'outro']),
    message: vine.string().trim().minLength(3).maxLength(500),
  })
)

/**
 * Validador para marcar alerta como lido
 */
export const markAsReadValidator = vine.compile(
  vine.object({
    isRead: vine.boolean(),
  })
)
