/**
 * Validadores para autenticação
 * 
 * @description Define validações para registro e login
 * @author Sistema
 */
import vine from '@vinejs/vine'

/**
 * Validador para registro de novo usuário
 */
export const registerValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    email: vine.string().trim().email().normalizeEmail().maxLength(254),
    password: vine.string().minLength(8).maxLength(255),
  })
)

/**
 * Validador para login de usuário
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),
    password: vine.string(),
  })
)
