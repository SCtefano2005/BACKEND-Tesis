// src/routes/viaje.routes.ts
import { Router } from 'express';
import * as cont from '../controllers/viaje.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// 📌 Crear un viaje
router.post('/', authMiddleware(['admin']), cont.crearViaje);

// 📌 Editar un viaje por ID
router.put('/:id', authMiddleware(['admin']) ,cont.editarViaje);

// 📌 Eliminar un viaje por ID
router.delete('/:id', authMiddleware(['admin']) , cont.eliminarViaje);

// 📌 Buscar viajes por DNI de conductor
router.get('/conductor/:dni', authMiddleware(['admin', 'conductor']) , cont.buscarViajesPorConductor);

// 📌 Buscar viajes por placa de bus
router.get('/bus/:placa', authMiddleware(['admin', 'pasajero']) , cont.buscarViajesPorBus);

// 📌 Buscar viajes por nombre de ruta
router.get('/ruta/:nombre', authMiddleware(['admin']), cont.buscarViajesPorRuta);
router.get('/ruta/:id', authMiddleware(['admin']), cont.buscarViajesPorid);

export default router;
