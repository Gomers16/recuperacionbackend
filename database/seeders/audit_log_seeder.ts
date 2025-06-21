import { BaseSeeder } from '@adonisjs/lucid/seeders'
import AuditLog from '#models/audit_log'
import Console from '#models/console'

export default class extends BaseSeeder {
  async run() {
    // --- Lógica para el seeder de Audit Logs ---

    // ¡Aquí está la corrección! Doble casteo a 'unknown' y luego a 'number'
    const existingAuditLogsCount = await AuditLog.query().count('*') as unknown as number
    if (existingAuditLogsCount > 0) { // Ahora la comparación es válida para TypeScript
      console.log('La tabla de logs de auditoría ya tiene datos. Saltando AuditLogSeeder.')
      return
    }

    // El resto del código permanece igual...
    const consoles = await Console.all()

    if (consoles.length === 0) {
      console.warn('AuditLogSeeder: No se encontraron consolas para crear logs de auditoría. Ejecuta ConsoleSeeder primero o asegúrate de que existan consolas.')
      return
    }

    const logsToCreate = []

    const ps5 = consoles.find(c => c.serialNumber === 'PS5-001-XYZ')
    const xbox = consoles.find(c => c.serialNumber === 'XSX-ABC-789')
    const ps4 = consoles.find(c => c.serialNumber === 'PS4-GHI-123')

    if (ps5) {
      logsToCreate.push({
        consoleId: ps5.id,
        consoleSerialNumber: ps5.serialNumber,
        eventType: 'CREACION',
        eventDescription: `Consola '${ps5.name}' (${ps5.serialNumber}) creada mediante seeder.`,
      })
      logsToCreate.push({
        consoleId: ps5.id,
        consoleSerialNumber: ps5.serialNumber,
        eventType: 'ACTUALIZACION',
        eventDescription: `Consola '${ps5.name}' (${ps5.serialNumber}) actualizada con detalles iniciales.`,
      })
    }

    if (xbox) {
      logsToCreate.push({
        consoleId: xbox.id,
        consoleSerialNumber: xbox.serialNumber,
        eventType: 'CREACION',
        eventDescription: `Consola '${xbox.name}' (${xbox.serialNumber}) creada mediante seeder.`,
      })
    }

    if (ps4) {
        logsToCreate.push({
          consoleId: ps4.id,
          consoleSerialNumber: ps4.serialNumber,
          eventType: 'CREACION',
          eventDescription: `Consola '${ps4.name}' (${ps4.serialNumber}) creada mediante seeder.`,
        })
        logsToCreate.push({
            consoleId: ps4.id,
            consoleSerialNumber: ps4.serialNumber,
            eventType: 'DADA_DE_BAJA',
            eventDescription: `Consola '${ps4.name}' (${ps4.serialNumber}) marcada como inactiva mediante seeder.`,
          })
      }

    if (logsToCreate.length > 0) {
        await AuditLog.createMany(logsToCreate)
        console.log('AuditLogSeeder: Logs de auditoría insertados exitosamente.')
    } else {
        console.log('AuditLogSeeder: No hay logs de auditoría para insertar (quizás no se encontraron consolas coincidentes).')
    }
  }
}