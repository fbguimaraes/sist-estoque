/**
 * Model Category
 * 
 * @description Modelo para entidade Category (categorias de produtos)
 * @author Sistema
 */
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Product from './product.js'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  /**
   * Nome da categoria
   */
  @column()
  declare name: string

  /**
   * Descrição da categoria
   */
  @column()
  declare description: string | null

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
   * Relacionamento: produtos nesta categoria
   */
  @hasMany(() => Product)
  declare products: HasMany<typeof Product>
}