import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'products';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.string('name').notNullable().unique();
            table.text('description').nullable();
            table.decimal('price', 10, 2).notNullable();
            table.integer('stock_quantity').notNullable().defaultTo(0);
            table.integer('minimum_stock').notNullable().defaultTo(1);
            table.integer('category_id').unsigned().notNullable();
            table.foreign('category_id').references('id').inTable('categories').onDelete('CASCADE').onUpdate('CASCADE');
            table.index('category_id');
            table.index('stock_quantity');
            table.timestamp('created_at').notNullable();
            table.timestamp('updated_at').notNullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1768929500195_create_create_products_table.js.map