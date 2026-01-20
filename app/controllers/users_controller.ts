/**
 * Controller para usuários
 * 
 * @description Gerencia operações CRUD de usuários
 * @author Sistema
 */
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  /**
   * Lista todos os usuários
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async index({ response }: HttpContext) {
    const users = await User.all()
    return response.ok(users)
  }

  /**
   * Exibe um usuário específico
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async show({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return response.ok(user)
  }

  /**
   * Atualiza um usuário
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async update({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const data = request.only(['name', 'role'])

    await user.merge(data).save()

    return response.ok(user)
  }

  /**
   * Remove um usuário
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()

    return response.noContent()
  }
}