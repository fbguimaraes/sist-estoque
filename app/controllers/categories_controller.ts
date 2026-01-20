/**
 * Controller para categorias
 * 
 * @description Gerencia operações CRUD de categorias
 * @author Sistema
 */
import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import { createCategoryValidator } from '#validators/category'

export default class CategoriesController {
  /**
   * Lista todas as categorias
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async index({ response }: HttpContext) {
    const categories = await Category.all()
    return response.ok(categories)
  }

  /**
   * Cria uma nova categoria
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async store({ request, response }: HttpContext) {
    const data = await createCategoryValidator.validate(request.all())
    const category = await Category.create(data)

    return response.created(category)
  }

  /**
   * Exibe uma categoria específica
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async show({ params, response }: HttpContext) {
    const category = await Category.query().where('id', params.id).preload('products').firstOrFail()
    return response.ok(category)
  }

  /**
   * Atualiza uma categoria
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async update({ params, request, response }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    const data = await createCategoryValidator.validate(request.all())

    await category.merge(data).save()

    return response.ok(category)
  }

  /**
   * Remove uma categoria
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async destroy({ params, response }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    await category.delete()

    return response.noContent()
  }
}