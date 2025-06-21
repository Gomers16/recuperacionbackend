import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Console from '#models/console' // Asegúrate de que la ruta a tu modelo Console sea correcta

export default class extends BaseSeeder {
  async run() {
    // --- Lógica para el seeder de Consolas ---

    // ¡Aquí está la corrección! Doble casteo a 'unknown' y luego a 'number'
    const existingConsolesCount = await Console.query().count('*') as unknown as number
    if (existingConsolesCount > 0) { // Ahora la comparación es válida para TypeScript
      console.log('La tabla de consolas ya tiene datos. Saltando ConsoleSeeder.')
      return // Si ya hay datos, no hacemos nada más.
    }

    // Si la tabla está vacía, procedemos a insertar los datos de ejemplo.
    await Console.createMany([
      {
        name: 'PlayStation 5',
        manufacturer: 'Sony',
        serialNumber: 'PS5-001-XYZ',
        isActive: true,
      },
      {
        name: 'Xbox Series X',
        manufacturer: 'Microsoft',
        serialNumber: 'XSX-ABC-789',
        isActive: true,
      },
      {
        name: 'Nintendo Switch',
        manufacturer: 'Nintendo',
        serialNumber: 'NSW-DEF-456',
        isActive: true,
      },
      {
        name: 'PlayStation 4',
        manufacturer: 'Sony',
        serialNumber: 'PS4-GHI-123',
        isActive: false, // Una consola inactiva para probar el soft delete
      },
      {
        name: 'Steam Deck',
        manufacturer: 'Valve',
        serialNumber: 'SD-JKL-007',
        isActive: true,
      },
    ])
    console.log('ConsoleSeeder: Consolas insertadas exitosamente.')
  }
}