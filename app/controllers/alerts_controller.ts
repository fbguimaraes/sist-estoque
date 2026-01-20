/**
 * Controller para alertas
 * 
 * @description Gerencia operações com alertas do sistema
 * @author Sistema
 */
import type { HttpContext } from '@adonisjs/core/http'
import Alert from '#models/alert'
import { createAlertValidator, markAsReadValidator } from '#validators/alert'

export default class AlertsController {
  /**
   * Lista todos os alertas
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async index({ response }: HttpContext) {
    const alerts = await Alert.query().preload('product')
    return response.ok(alerts)
  }

  /**
   * Cria um novo alerta
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async store({ request, response }: HttpContext) {
    const data = await createAlertValidator.validate(request.all())
    const alert = await Alert.create(data)

    await alert.load('product')

    return response.created(alert)
  }

  /**
   * Exibe um alerta específico
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async show({ params, response }: HttpContext) {
    const alert = await Alert.query().where('id', params.id).preload('product').firstOrFail()

    return response.ok(alert)
  }

  /**
   * Marca um alerta como lido/não lido
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async markAsRead({ params, request, response }: HttpContext) {
    const alert = await Alert.findOrFail(params.id)
    const data = await markAsReadValidator.validate(request.all())

    await alert.merge(data).save()

    return response.ok(alert)
  }

  /**
   * Remove um alerta
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async destroy({ params, response }: HttpContext) {
    const alert = await Alert.findOrFail(params.id)
    await alert.delete()

    return response.noContent()
  }

  /**
   * Lista alertas não lidos
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async unread({ response }: HttpContext) {
    const alerts = await Alert.query().where('is_read', false).preload('product')

    return response.ok(alerts)
  }

  /**
   * Marca todos os alertas como lidos
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async markAllAsRead({ response }: HttpContext) {
    await Alert.query().where('is_read', false).update({ isRead: true })

    return response.ok({ message: 'Todos os alertas marcados como lidos' })
  }
}