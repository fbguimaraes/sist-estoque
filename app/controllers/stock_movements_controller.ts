/**
 * Controller para movimentações de estoque
 * 
 * @description Gerencia operações de movimentações de estoque
 * @author Sistema
 */
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import StockMovement from '#models/stock_movement'
import Product from '#models/product'
import Alert from '#models/alert'
import { createStockMovementValidator } from '#validators/stock_movement'

export default class StockMovementsController {
  /**
   * Lista todas as movimentações
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async index({ response }: HttpContext) {
    const movements = await StockMovement.query().preload('product').preload('user')
    return response.ok(movements)
  }

  /**
   * Cria uma nova movimentação de estoque
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async store({ request, response, auth }: HttpContext) {
    const data = await createStockMovementValidator.validate(request.all())
    const user = auth.use('api').user!

    // Atualizar estoque do produto
    const product = await Product.findOrFail(data.productId)

    if (data.type === 'entrada') {
      product.stockQuantity += data.quantity
    } else {
      if (product.stockQuantity < data.quantity) {
        return response.badRequest({
          message: 'Quantidade insuficiente em estoque',
        })
      }
      product.stockQuantity -= data.quantity
    }

    await product.save()

    // Criar movimentação
    const movement = await StockMovement.create({
      productId: data.productId,
      userId: user.id,
      type: data.type,
      quantity: data.quantity,
      movementDate: data.movementDate ? DateTime.fromISO(String(data.movementDate)) : DateTime.now(),
    })

    // Verificar se precisa gerar alerta
    if (product.stockQuantity <= product.minimumStock) {
      const alertType = product.stockQuantity === 0 ? 'fora_estoque' : 'estoque_baixo'
      const message = `${product.name}: ${alertType === 'fora_estoque' ? 'Produto fora de estoque' : 'Estoque abaixo do mínimo'}`

      await Alert.create({
        productId: product.id,
        alertType,
        message,
        isRead: false,
      })
    }

    await movement.load('product')
    await movement.load('user')

    return response.created(movement)
  }

  /**
   * Exibe uma movimentação específica
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async show({ params, response }: HttpContext) {
    const movement = await StockMovement.query()
      .where('id', params.id)
      .preload('product')
      .preload('user')
      .firstOrFail()

    return response.ok(movement)
  }

  /**
   * Lista movimentações por produto
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async byProduct({ params, response }: HttpContext) {
    const movements = await StockMovement.query()
      .where('product_id', params.productId)
      .preload('user')

    return response.ok(movements)
  }
}