// src/routes/bus.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { 
  crearBus, 
  editarBus, 
  buscarBusPorPlaca, 
  eliminarBus,
  obtenerBusPorId
} from "../controllers/bus.controller";

const router = Router();

// ✅ Crear bus (solo admin)
router.post(
  "/",
  authMiddleware(['admin']),
  crearBus
);

// ✅ Buscar bus por placa
router.get(
  "/:placa",
  authMiddleware(['admin']), // ejemplo: admin y usuarios pueden consultar
  buscarBusPorPlaca
);

// ✅ Editar bus por placa
router.put(
  "/:placa",
  authMiddleware(['admin']),
  editarBus
);

// ✅ Eliminar bus por placa
router.delete(
  "/:placa",
  authMiddleware(['admin']),
  eliminarBus
);
// ✅ Buscar bus por ID
router.get(
  "/id/:id",
  authMiddleware(['admin']), // solo admin puede consultar por ID
  obtenerBusPorId
);
export default router;
