/**
 * Controller para produtos
 * 
 * @description Gerencia operações CRUD de produtos
 * @author Sistema
 */
import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { createProductValidator, updateStockValidator } from '#validators/product'

export default class ProductsController {
  /**
   * Lista todos os produtos
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async index({ response }: HttpContext) {
    const products = await Product.query().preload('category')
    return response.ok(products)
  }

  /**
   * Cria um novo produto
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async store({ request, response }: HttpContext) {
    const data = await createProductValidator.validate(request.all())
    const product = await Product.create(data)

    return response.created(product)
  }

  /**
   * Exibe um produto específico
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async show({ params, response }: HttpContext) {
    const product = await Product.query()
      .where('id', params.id)
      .preload('category')
      .preload('stockMovements')
      .preload('alerts')
      .firstOrFail()

    return response.ok(product)
  }

  /**
   * Atualiza um produto
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async update({ params, request, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const data = await createProductValidator.validate(request.all())

    await product.merge(data).save()

    return response.ok(product)
  }

  /**
   * Remove um produto
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async destroy({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()

    return response.noContent()
  }

  /**
   * Atualiza o estoque de um produto
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async updateStock({ params, request, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const data = await updateStockValidator.validate(request.all())

    await product.merge(data).save()

    return response.ok(product)
  }
}