/**
 * Model StockMovement
 * 
 * @description Modelo para entidade StockMovement (movimentações de estoque)
 * @author Sistema
 */
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from './product.js'
import User from './user.js'

export default class StockMovement extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  /**
   * ID do produto
   */
  @column()
  declare productId: number

  /**
   * ID do usuário que registrou a movimentação
   */
  @column()
  declare userId: number

  /**
   * Tipo de movimentação: entrada ou saída
   */
  @column()
  declare type: 'entrada' | 'saida'

  /**
   * Quantidade movimentada
   */
  @column()
  declare quantity: number

  /**
   * Data da movimentação
   */
  @column.dateTime()
  declare movementDate: DateTime

  /**
   * Data de criação do registro
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  /**
   * Relacionamento: produto movimentado
   */
  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  /**
   * Relacionamento: usuário que registrou
   */
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}