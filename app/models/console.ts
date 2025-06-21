// app/models/Console.ts
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations' // ¡Nueva importación de tipo!
import AuditLog from '#models/audit_log'

export default class Console extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare manufacturer: string

  @column()
  declare serialNumber: string

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relación con los logs de auditoría
  @hasMany(() => AuditLog)
  declare auditLogs: HasMany<typeof AuditLog> // Se mantiene como estaba antes de mi última sugerencia
}