/**
 * Controller para autenticação
 * 
 * @description Gerencia operações de autenticação (register, login, logout, me)
 * @author Sistema
 */
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/auth'

export default class AuthController {
  /**
   * Registra um novo usuário
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async register({ request, response }: HttpContext) {
    const data = await registerValidator.validate(request.all())

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'user',
    })

    const token = await User.accessTokens.create(user)

    return response.created({
      user,
      token: token.value?.release(),
    })
  }

  /**
   * Faz login de um usuário
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async login({ request, response }: HttpContext) {
    const { email, password } = await loginValidator.validate(request.all())

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return response.ok({
      user,
      token: token.value?.release(),
    })
  }

  /**
   * Retorna dados do usuário autenticado
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async me({ auth, response }: HttpContext) {
    const user = auth.use('api').user

    return response.ok(user)
  }

  /**
   * Faz logout do usuário (revoga token)
   * 
   * @param {HttpContext} ctx - Contexto HTTP
   * @returns {Promise<void>}
   */
  async logout({ auth, response }: HttpContext) {
    const user = auth.use('api').user!
    const token = (auth as any).use('api').token

    await User.accessTokens.delete(user, token)

    return response.noContent()
  }
}