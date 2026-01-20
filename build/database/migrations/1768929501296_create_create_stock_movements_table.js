import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'stock_movements';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.integer('product_id').unsigned().notNullable();
            table.integer('user_id').unsigned().notNullable();
            table.enum('type', ['entrada', 'saida']).notNullable();
            table.integer('quantity').notNullable();
            table.timestamp('movement_date').notNullable();
            table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE').onUpdate('CASCADE');
            table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
            table.index('product_id');
            table.index('user_id');
            table.index('movement_date');
            table.timestamp('created_at').notNullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1768929501296_create_create_stock_movements_table.js.map