// src/routes/ruta.routes.ts
import { Router } from 'express';
import * as rutaController from '../controllers/ruta.controller';

const router = Router();

// 📌 Crear nueva ruta
router.post('/', rutaController.crearRuta);

// 📌 Editar ruta por ID
router.put('/:id', rutaController.editarRuta);

// 📌 Buscar todas las rutas o por nombre (?nombre=XYZ)
router.get('/', rutaController.buscarRutas);

// 📌 Eliminar ruta por ID
router.delete('/:id', rutaController.eliminarRuta);

export default router;
