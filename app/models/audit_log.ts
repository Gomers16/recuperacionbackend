// app/models/AuditLog.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Console from '#models/console' // Importa el modelo Console para la relación

export default class AuditLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // --- ¡ESTA ES LA CLAVE para solucionar tu error! ---
  // Mapea directamente la columna 'console_id' de la migración a 'consoleId' en el modelo.
  @column()
  declare consoleId: number // Propiedad que referencia el ID de la consola

  @column()
  declare consoleSerialNumber: string // Columna adicional para auditoría rápida

  @column()
  declare eventType: string // Tipo de evento (ej. 'CREACION', 'ACTUALIZACION')

  @column()
  declare eventDescription: string // Descripción detallada del evento

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime // Marca de tiempo de cuándo ocurrió el evento

  // Relación con el modelo Console (un log pertenece a una consola)
  // Esto es útil si necesitas acceder a los detalles de la consola desde un log,
  // aunque ya guardes el serialNumber directamente.
  @belongsTo(() => Console)
  declare console: BelongsTo<typeof Console>
}