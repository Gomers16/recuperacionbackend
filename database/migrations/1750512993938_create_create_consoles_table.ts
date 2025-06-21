import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'consoles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary() // ID autoincremental
      table.string('name', 255).notNullable() // Nombre de la consola
      table.string('manufacturer', 255).notNullable() // Fabricante
      table.string('serial_number', 255).notNullable().unique() // Número de serie único
      table.boolean('is_active').defaultTo(true).notNullable() // Para Soft Delete

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}