// src/routes/usuario.routes.ts
import { Router } from 'express';
import { actualizarConductor, borrarConductor, obtenerConductorPorDni, registrarUsuarioConductor, obtenerConductorPorId } from '../controllers/usuario.controller';
import { validate } from '../middlewares/validate';
import { crearUsuarioSchema } from '../utils/usuario.validation';
import { authMiddleware } from '../middlewares/auth.middleware';
const router = Router();

router.post('/conductores',  authMiddleware(['admin']) , registrarUsuarioConductor);
router.get('/conductores/id/:id', authMiddleware(['admin']), obtenerConductorPorId);
router.get('/conductores/:dni', authMiddleware(['admin']) ,obtenerConductorPorDni);      // Leer
router.put('/conductores/:dni', authMiddleware(['admin']) ,actualizarConductor);         // Editar
router.delete('/conductores/:dni', authMiddleware(['admin']), borrarConductor);          // Eliminar

export default router;
