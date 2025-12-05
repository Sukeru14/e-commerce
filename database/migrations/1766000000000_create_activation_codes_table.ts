import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'activation_codes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('code').notNullable().unique()

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')

      table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('SET NULL')

      table
        .integer('order_item_id')
        .unsigned()
        .references('id')
        .inTable('order_items')
        .onDelete('SET NULL')

      table.boolean('used').notNullable().defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
