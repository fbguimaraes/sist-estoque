/**
 * Model User
 * 
 * @description Modelo para entidade User com autenticação por token
 * @author Sistema
 */
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import StockMovement from './stock_movement.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  /**
   * Nome do usuário
   */
  @column()
  declare name: string

  /**
   * Email único do usuário
   */
  @column()
  declare email: string

  /**
   * Senha criptografada (não serializada)
   */
  @column({ serializeAs: null })
  declare password: string

  /**
   * Papel do usuário (admin, user, etc)
   */
  @column()
  declare role: string

  /**
   * Data de criação
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  /**
   * Data da última atualização
   */
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Relacionamento: movimentações de estoque registradas por este usuário
   */
  @hasMany(() => StockMovement)
  declare stockMovements: HasMany<typeof StockMovement>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}