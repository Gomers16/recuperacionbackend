import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'audit_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('console_id').unsigned().references('id').inTable('consoles').onDelete('CASCADE') // Referencia a la consola
      table.string('console_serial_number', 255).notNullable() // Para referencia rápida sin JOIN
      table.string('event_type', 50).notNullable() // Ej: 'CREACION', 'ACTUALIZACION', 'DADA_DE_BAJA'
      table.string('event_description').notNullable() // Descripción del evento

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}