import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Console from '#models/console' // Asegúrate de que la ruta a tu modelo Console sea correcta

export default class extends BaseSeeder {
  async run() {
    // --- Lógica para el seeder de Consolas ---

    // Obtener el conteo de consolas existentes
    // El doble casteo es necesario porque `count('*')` puede devolver un string en algunos drivers de DB.
    const existingConsolesCount = (await Console.query().count('*')) as unknown as number
    if (existingConsolesCount > 0) {
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
      // --- Consolas adicionales (20 más) ---
      {
        name: 'Nintendo 3DS',
        manufacturer: 'Nintendo',
        serialNumber: 'N3DS-A1B-2C3',
        isActive: true,
      },
      {
        name: 'PlayStation 3',
        manufacturer: 'Sony',
        serialNumber: 'PS3-D4E-5F6',
        isActive: false,
      },
      {
        name: 'Xbox One',
        manufacturer: 'Microsoft',
        serialNumber: 'XONE-G7H-8I9',
        isActive: true,
      },
      {
        name: 'Wii U',
        manufacturer: 'Nintendo',
        serialNumber: 'WIU-J1K-2L3',
        isActive: false,
      },
      {
        name: 'PlayStation 2',
        manufacturer: 'Sony',
        serialNumber: 'PS2-M4N-5O6',
        isActive: true,
      },
      {
        name: 'Xbox 360',
        manufacturer: 'Microsoft',
        serialNumber: 'X360-P7Q-8R9',
        isActive: true,
      },
      {
        name: 'Nintendo Wii',
        manufacturer: 'Nintendo',
        serialNumber: 'WII-S1T-2U3',
        isActive: true,
      },
      {
        name: 'Sega Dreamcast',
        manufacturer: 'Sega',
        serialNumber: 'SDC-V4W-5X6',
        isActive: false,
      },
      {
        name: 'Nintendo 64',
        manufacturer: 'Nintendo',
        serialNumber: 'N64-Y7Z-8A9',
        isActive: true,
      },
      {
        name: 'PlayStation (PS1)',
        manufacturer: 'Sony',
        serialNumber: 'PS1-B1C-2D3',
        isActive: true,
      },
      {
        name: 'Xbox (Original)',
        manufacturer: 'Microsoft',
        serialNumber: 'XBOX-E4F-5G6',
        isActive: true,
      },
      {
        name: 'Sega Genesis',
        manufacturer: 'Sega',
        serialNumber: 'SGN-H7I-8J9',
        isActive: false,
      },
      {
        name: 'Super Nintendo',
        manufacturer: 'Nintendo',
        serialNumber: 'SNES-K1L-2M3',
        isActive: true,
      },
      {
        name: 'NES',
        manufacturer: 'Nintendo',
        serialNumber: 'NES-N4O-5P6',
        isActive: true,
      },
      {
        name: 'Atari 2600',
        manufacturer: 'Atari',
        serialNumber: 'AT26-Q7R-8S9',
        isActive: true,
      },
      {
        name: 'Xbox Series S',
        manufacturer: 'Microsoft',
        serialNumber: 'XSS-T1U-2V3',
        isActive: true,
      },
      {
        name: 'Nintendo Switch Lite',
        manufacturer: 'Nintendo',
        serialNumber: 'NSW-L-W4X-5Y6',
        isActive: true,
      },
      {
        name: 'PlayStation Portable (PSP)',
        manufacturer: 'Sony',
        serialNumber: 'PSP-Z7A-8B9',
        isActive: false,
      },
      {
        name: 'Nintendo DS',
        manufacturer: 'Nintendo',
        serialNumber: 'NDS-C1D-2E3',
        isActive: true,
      },
      {
        name: 'Game Boy Advance',
        manufacturer: 'Nintendo',
        serialNumber: 'GBA-F4G-5H6',
        isActive: true,
      },
    ])
    console.log('ConsoleSeeder: Consolas insertadas exitosamente.')
  }
}
