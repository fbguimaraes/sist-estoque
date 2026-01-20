/**
 * Model Product
 * 
 * @description Modelo para entidade Product (produtos do estoque)
 * @author Sistema
 */
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Category from './category.js'
import StockMovement from './stock_movement.js'
import Alert from './alert.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  /**
   * Nome do produto
   */
  @column()
  declare name: string

  /**
   * Descrição do produto
   */
  @column()
  declare description: string | null

  /**
   * Preço do produto
   */
  @column()
  declare price: number

  /**
   * Quantidade em estoque
   */
  @column()
  declare stockQuantity: number

  /**
   * Quantidade mínima de estoque
   */
  @column()
  declare minimumStock: number

  /**
   * ID da categoria
   */
  @column()
  declare categoryId: number

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
   * Relacionamento: categoria do produto
   */
  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  /**
   * Relacionamento: movimentações de estoque deste produto
   */
  @hasMany(() => StockMovement)
  declare stockMovements: HasMany<typeof StockMovement>

  /**
   * Relacionamento: alertas deste produto
   */
  @hasMany(() => Alert)
  declare alerts: HasMany<typeof Alert>
}