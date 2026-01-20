/**
 * Migration para criar tabela stock_movements
 * 
 * @description Registra movimentações de estoque (entradas e saídas)
 * @author Sistema
 * @since 2026-01-20
 */
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stock_movements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('product_id').unsigned().notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.enum('type', ['entrada', 'saida']).notNullable()
      table.integer('quantity').notNullable()
      table.timestamp('movement_date').notNullable()

      // Foreign keys
      table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE').onUpdate('CASCADE')
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')

      // Índices
      table.index('product_id')
      table.index('user_id')
      table.index('movement_date')

      table.timestamp('created_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}