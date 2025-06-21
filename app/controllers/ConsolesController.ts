/* eslint-disable @unicorn/filename-case */
// app/Controllers/Http/ConsolesController.ts
// (Asumiendo que esta es la ruta de tu controlador en AdonisJS)

import Console from '#models/console' // Asegúrate que la ruta a tu modelo sea correcta
import { HttpContext } from '@adonisjs/core/http'

export default class ConsolesController {
  /**
   * [CRUD: CREATE]
   * Crea una nueva consola
   * POST /consoles
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['name', 'manufacturer', 'serialNumber'])

      if (!data.serialNumber || data.serialNumber.trim() === '') {
        return response.badRequest({ message: 'El número de serie es requerido.' })
      }

      // Añadir isActive por defecto en la creación si no viene en el payload.
      // Las nuevas consolas son activas por defecto.
      const console = await Console.create({ ...data, isActive: true })

      return response.created({
        message: 'Consola creada exitosamente.',
        console: console.toJSON(),
      })
    } catch (error: any) {
      // Código de error 23505 es común para UNIQUE violation en PostgreSQL
      if (error.code === '23505') {
        return response.conflict({ message: 'Error: El número de serie ya existe.' })
      }
      console.error('Error al crear consola:', error) // Log detallado para depuración
      return response.badRequest({ message: 'No se pudo crear la consola.' })
    }
  }

  /**
   * [CRUD: READ con Paginación, Filtrado y Ordenamiento]
   * Lista consolas con paginación y filtros
   * GET /consoles?page=1&limit=10&sortBy=name&sortOrder=asc&search=foo&is_active=1
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const sortBy = request.input('sortBy', 'createdAt') // Campo por defecto para ordenar
      const sortOrder = request.input('sortOrder', 'desc') // Orden por defecto (asc/desc)
      const searchQuery = request.input('search', '')

      // Parámetros de filtro de estado
      const filterStatusParam = request.input('is_active') // Puede ser '1', '0' o undefined
      const includeInactiveParam = request.input('includeInactive') // Puede ser '1', '0' o undefined

      let query = Console.query()

      // Lógica para aplicar el filtro de estado `isActive`
      // Si el frontend envió 'is_active' (con 1 para activas o 0 para inactivas)
      if (filterStatusParam !== undefined && filterStatusParam !== null) {
        // Convierte el string '1'/'0' a booleano true/false
        query = query.where('isActive', filterStatusParam === '1' || filterStatusParam === 'true')
      }
      // Si no se especificó 'is_active', pero se especificó NO incluir inactivas (includeInactive=0)
      else if (includeInactiveParam === '0' || includeInactiveParam === 'false') {
        query = query.where('isActive', true) // Solo mostrar las activas
      }
      // Si no hay 'is_active' y 'includeInactive' es '1' (o undefined),
      // no se aplica ningún filtro de estado, mostrando activas e inactivas.

      // Aplicar búsqueda si hay un término de búsqueda
      if (searchQuery) {
        query.where((q) => {
          // Usar 'ILIKE' para búsqueda insensible a mayúsculas/minúsculas (común en PostgreSQL)
          // Si usas MySQL/SQLite, 'LIKE' puede ser suficiente o necesitar configuraciones de collation.
          q.orWhere('name', 'ILIKE', `%${searchQuery}%`)
            .orWhere('manufacturer', 'ILIKE', `%${searchQuery}%`)
            .orWhere('serialNumber', 'ILIKE', `%${searchQuery}%`)
        })
      }

      // Aplicar ordenamiento
      // Asegúrate que el `sortBy` sea una columna válida para evitar errores SQL
      query.orderBy(sortBy, sortOrder.toUpperCase())

      // Ejecutar paginación
      const consoles = await query.paginate(page, limit)
      const originalMeta = consoles.getMeta()

      // Construir el objeto meta para el frontend con los nombres de propiedades esperados
      const metaForFrontend = {
        total: originalMeta.total,
        per_page: originalMeta.perPage,
        current_page: originalMeta.currentPage,
        last_page: originalMeta.lastPage,
        first_page: 1,
        // Construir URLs de paginación que mantengan los parámetros de la consulta actual
        first_page_url: `${request.url().split('?')[0]}?page=1&limit=${limit}&${request.parsedUrl.query || ''}`,
        last_page_url: `${request.url().split('?')[0]}?page=${originalMeta.lastPage}&limit=${limit}&${request.parsedUrl.query || ''}`,
        next_page_url: originalMeta.nextPageUrl ? originalMeta.nextPageUrl : null,
        prev_page_url: originalMeta.previousPageUrl ? originalMeta.previousPageUrl : null,
        path: originalMeta.baseUrl,
      }

      return response.ok({
        message: 'Consolas obtenidas exitosamente.',
        meta: metaForFrontend,
        consoles: consoles.toJSON().data, // `toJSON().data` obtiene solo los registros
      })
    } catch (error: any) {
      console.error('Error al obtener consolas:', error) // Log detallado
      return response.badRequest({
        message: 'No se pudieron obtener las consolas.',
        error: error.message,
      })
    }
  }

  /**
   * [CRUD: READ]
   * Obtiene una consola por ID
   * GET /consoles/:id
   */
  async show({ params, response }: HttpContext) {
    try {
      const console = await Console.find(params.id)
      if (!console) {
        return response.notFound({ message: 'Consola no encontrada.' })
      }
      return response.ok({
        message: 'Consola obtenida exitosamente.',
        console: console.toJSON(),
      })
    } catch (error: any) {
      console.error('Error al obtener consola por ID:', error) // Log detallado
      return response.badRequest({
        message: 'No se pudo obtener la consola.',
        error: error.message,
      })
    }
  }

  /**
   * [CRUD: UPDATE]
   * Actualiza una consola por ID (incluye cambio de estado isActive - Soft Delete)
   * PUT /consoles/:id
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const console = await Console.find(params.id)
      if (!console) {
        return response.notFound({ message: 'Consola no encontrada.' })
      }

      // Obtiene solo los campos que están presentes en el cuerpo de la solicitud
      const rawData = request.only(['name', 'manufacturer', 'serialNumber', 'isActive'])
      // Objeto para almacenar solo los datos validados y que se actualizarán
      const dataToUpdate: { [key: string]: any } = {}

      // Aplicar validaciones y asignar valores SOLO si el campo está presente en el rawData
      if (Object.prototype.hasOwnProperty.call(rawData, 'name')) {
        dataToUpdate.name = rawData.name
      }
      if (Object.prototype.hasOwnProperty.call(rawData, 'manufacturer')) {
        dataToUpdate.manufacturer = rawData.manufacturer
      }

      // Validar y asignar serialNumber
      if (Object.prototype.hasOwnProperty.call(rawData, 'serialNumber')) {
        const newSerialNumber = rawData.serialNumber
        if (
          newSerialNumber === null ||
          newSerialNumber === undefined ||
          newSerialNumber.trim() === ''
        ) {
          return response.badRequest({
            message: 'El número de serie es requerido y no puede ser nulo o vacío.',
          })
        }
        // Validar unicidad del serialNumber solo si ha cambiado respecto al valor actual de la consola
        if (newSerialNumber !== console.serialNumber) {
          const existingConsole = await Console.query()
            .where('serialNumber', newSerialNumber)
            .first()
          if (existingConsole && existingConsole.id !== console.id) {
            return response.conflict({ message: 'Error: El número de serie ya existe.' })
          }
        }
        dataToUpdate.serialNumber = newSerialNumber
      }

      // Asignar isActive si está presente en la solicitud (maneja true/false o 1/0)
      if (Object.prototype.hasOwnProperty.call(rawData, 'isActive')) {
        dataToUpdate.isActive = rawData.isActive
      }

      // Fusionar solo los datos preparados en el modelo de la consola
      console.merge(dataToUpdate)
      await console.save() // Guarda los cambios en la base de datos

      return response.ok({
        message: 'Consola actualizada exitosamente.',
        console: console.toJSON(),
      })
    } catch (error: any) {
      if (error.code === '23505') {
        // Código de error para unique constraint violation
        return response.conflict({ message: 'Error: El número de serie ya existe.' })
      }
      console.error('Error al actualizar consola:', error) // Log detallado
      return response.badRequest({
        message: 'No se pudo actualizar la consola.',
        error: error.message,
      })
    }
  }

  /**
   * [CRUD: DELETE - Hard Delete]
   * Elimina permanentemente una consola por ID
   * DELETE /consoles/:id
   *
   * NOTA IMPORTANTE: Esta ruta realiza una ELIMINACIÓN PERMANENTE.
   * Si tu frontend tiene un botón para "Inactivar" (soft delete),
   * ese botón NO DEBE llamar a esta ruta, sino al método PUT (update) con { isActive: false }.
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const console = await Console.find(params.id)
      if (!console) {
        return response.notFound({ message: 'Consola no encontrada.' })
      }

      await console.delete() // Esto realiza una eliminación permanente en AdonisJS por defecto

      return response.ok({
        message: 'Consola eliminada permanentemente.',
      })
    } catch (error: any) {
      console.error('Error al eliminar consola permanentemente:', error) // Log detallado
      return response.badRequest({
        message: 'No se pudo eliminar la consola permanentemente.',
        error: error.message,
      })
    }
  }
}
