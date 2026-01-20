import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'alerts';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.integer('product_id').unsigned().notNullable();
            table.enum('alert_type', ['estoque_baixo', 'fora_estoque', 'outro']).notNullable();
            table.string('message').notNullable();
            table.boolean('is_read').notNullable().defaultTo(false);
            table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE').onUpdate('CASCADE');
            table.index('product_id');
            table.index('is_read');
            table.index('alert_type');
            table.timestamp('created_at').notNullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1768929502502_create_create_alerts_table.js.map