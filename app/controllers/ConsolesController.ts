import Console from '#models/console'
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

      if (!data.serialNumber) {
        return response.badRequest({ message: 'El número de serie es requerido.' })
      }

      const console = await Console.create(data)
      return response.created({
        message: 'Consola creada exitosamente.',
        console: console.toJSON(),
      })
    } catch (error) {
      if (error.code === '23505') {
        return response.conflict({ message: 'Error: El número de serie ya existe.' })
      }
      return response.badRequest({ message: 'No se pudo crear la consola.' })
    }
  }

  /**
   * [CRUD: READ con Paginación]
   * Lista consolas con paginación
   * GET /consoles?page=1&limit=10&includeInactive=false
   */
  async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const includeInactive = request.input('includeInactive', false)

      let query = Console.query()
      if (!includeInactive) {
        query = query.where('is_active', true)
      }

      const consoles = await query.paginate(page, limit)
      
      // Obtener la meta original
      const originalMeta = consoles.getMeta()

      // CORRECCIÓN DE PAGINACIÓN:
      // Mapear 'lastPage' (AdonisJS) a 'last_page' (esperado por el frontend Vue)
      const metaForFrontend = {
        ...originalMeta, // Mantener todas las propiedades existentes
        last_page: originalMeta.lastPage, // Añadir 'last_page'
      };

      return response.ok({
        message: 'Consolas obtenidas exitosamente.',
        meta: metaForFrontend, // Usar el objeto meta corregido
        consoles: consoles.toJSON().data,
      })
    } catch (error: any) { // Se añadió ': any' para manejar el error como un objeto con message
      return response.badRequest({ 
        message: 'No se pudieron obtener las consolas.',
        error: error.message
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
      return response.badRequest({ 
        message: 'No se pudo obtener la consola.',
        error: error.message
      })
    }
  }

  /**
   * [CRUD: UPDATE]
   * Actualiza una consola por ID
   * PUT /consoles/:id
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const console = await Console.find(params.id)
      if (!console) {
        return response.notFound({ message: 'Consola no encontrada.' })
      }

      const data = request.only(['name', 'manufacturer', 'serialNumber', 'is_active']) // Asegúrate de incluir 'is_active' si también se puede actualizar
      
      // La validación de serialNumber = null es importante, pero si viene undefined (no enviado), merge lo ignora
      if (data.serialNumber === null) {
        return response.badRequest({ message: 'El número de serie no puede ser nulo.' })
      }

      console.merge(data)
      await console.save()

      return response.ok({
        message: 'Consola actualizada exitosamente.',
        console: console.toJSON(),
      })
    } catch (error: any) {
      if (error.code === '23505') {
        return response.conflict({ message: 'Error: El número de serie ya existe.' })
      }
      return response.badRequest({ 
        message: 'No se pudo actualizar la consola.',
        error: error.message
      })
    }
  }

  /**
   * [CRUD: DELETE - Soft Delete]
   * Desactiva una consola por ID
   * DELETE /consoles/:id
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const console = await Console.find(params.id)
      if (!console) {
        return response.notFound({ message: 'Consola no encontrada.' })
      }

      // 'isActive' vs 'is_active': Usa la propiedad correcta de tu modelo
      // Si tu columna es 'is_active' en la DB, asegúrate que tu modelo la mapee correctamente
      // o usa console.$attributes.is_active = false;
      if (!console.is_active) { // Asumiendo que tu modelo tiene una propiedad 'is_active'
        return response.conflict({ message: 'La consola ya está dada de baja.' })
      }

      console.is_active = false // Establece la columna 'is_active' a false
      await console.save()

      return response.ok({
        message: 'Consola dada de baja exitosamente.',
        console: console.toJSON(),
      })
    } catch (error: any) {
      return response.badRequest({ 
        message: 'No se pudo dar de baja la consola.',
        error: error.message
      })
    }
  }
}