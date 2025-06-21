// start/routes.ts
import router from '@adonisjs/core/services/router'
import ConsolesController from '../app/controllers/ConsolesController.js' // ¡Importa ConsolesController directamente!

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Grupo principal para las rutas de la API, ahora directamente bajo /api
router.group(() => {
  // POST /api/consoles - Crear consola
  router.post('/consoles', [ConsolesController, 'store']) // Pasa la clase y el método
  
  // GET /api/consoles - Listar consolas (con paginación)
  router.get('/consoles', [ConsolesController, 'index']) // Pasa la clase y el método
  
  // GET /api/consoles/:id - Obtener consola específica
  router.get('/consoles/:id', [ConsolesController, 'show']) // Pasa la clase y el método
  
  // PUT /api/consoles/:id - Actualizar consola
  router.put('/consoles/:id', [ConsolesController, 'update']) // Pasa la clase y el método
  
  // DELETE /api/consoles/:id - Soft Delete
  router.delete('/consoles/:id', [ConsolesController, 'destroy']) // Pasa la clase y el método
  
  // GET /api/consoles/:id/audit-logs - Logs de auditoría
  
  
}).prefix('/api') // Solo un prefijo '/api' para este grupo de rutas.