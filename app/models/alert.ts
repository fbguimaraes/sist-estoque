/**
 * Model Alert
 * 
 * @description Modelo para entidade Alert (alertas do sistema)
 * @author Sistema
 */
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from './product.js'

export default class Alert extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  /**
   * ID do produto relacionado ao alerta
   */
  @column()
  declare productId: number

  /**
   * Tipo de alerta
   */
  @column()
  declare alertType: 'estoque_baixo' | 'fora_estoque' | 'outro'

  /**
   * Mensagem do alerta
   */
  @column()
  declare message: string

  /**
   * Flag indicando se o alerta foi lido
   */
  @column()
  declare isRead: boolean

  /**
   * Data de criação do alerta
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  /**
   * Relacionamento: produto relacionado ao alerta
   */
  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>
}