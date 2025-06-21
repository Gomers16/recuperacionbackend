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
      return response.ok({
        message: 'Consolas obtenidas exitosamente.',
        meta: consoles.getMeta(),
        consoles: consoles.toJSON().data,
      })
    } catch (error) {
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
    } catch (error) {
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

      const data = request.only(['name', 'manufacturer', 'serialNumber'])
      if (data.serialNumber === null) {
        return response.badRequest({ message: 'El número de serie no puede ser nulo.' })
      }

      console.merge(data)
      await console.save()

      return response.ok({
        message: 'Consola actualizada exitosamente.',
        console: console.toJSON(),
      })
    } catch (error) {
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

      if (!console.isActive) {
        return response.conflict({ message: 'La consola ya está dada de baja.' })
      }

      console.isActive = false
      await console.save()

      return response.ok({
        message: 'Consola dada de baja exitosamente.',
        console: console.toJSON(),
      })
    } catch (error) {
      return response.badRequest({ 
        message: 'No se pudo dar de baja la consola.',
        error: error.message
      })
    }
  }
}