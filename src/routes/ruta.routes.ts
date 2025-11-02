// src/routes/ruta.routes.ts
import { Router } from 'express';
import * as rutaController from '../controllers/ruta.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// 📌 Crear nueva ruta
router.post('/', authMiddleware(['admin']),rutaController.crearRuta);

// 📌 Editar ruta por ID
router.put('/:id', authMiddleware(['admin']),rutaController.editarRuta);

// 📌 Buscar todas las rutas o por nombre (?nombre=XYZ)
router.get('/', authMiddleware(['admin']),rutaController.buscarRutas);

// 📌 Eliminar ruta por ID
router.delete('/:id', authMiddleware(['admin']),rutaController.eliminarRuta);
// Buscar ruta por ID
router.get('/id/:id', authMiddleware(['admin']), rutaController.buscarRutaPorId);


export default router;
