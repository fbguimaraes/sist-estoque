import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'users';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.string('email', 254).notNullable().unique();
            table.string('password').notNullable();
            table.string('role').notNullable().defaultTo('user');
            table.timestamp('created_at').notNullable();
            table.timestamp('updated_at').notNullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1768929107539_create_users_table.js.map