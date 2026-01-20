/**
 * Validadores para categorias
 * 
 * @description Define validações para operações com categorias
 * @author Sistema
 */
import vine from '@vinejs/vine'

/**
 * Validador para criação/atualização de categoria
 */
export const createCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    description: vine.string().trim().maxLength(1000).optional(),
  })
)
