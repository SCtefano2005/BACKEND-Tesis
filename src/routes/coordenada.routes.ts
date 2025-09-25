// src/routes/coordenada.routes.ts
import { Router } from "express";
import { guardarCoordenada, listarCoordenadasPorViaje } from "../controllers/coordenada.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * Rutas de Coordenadas
 * 
 * POST /api/coordenadas → Guardar coordenada
 * GET  /api/coordenadas/:viajeId → Listar coordenadas de un viaje
 */

// Guardar una coordenada en un viaje (requiere token de ESP32 o admin si quieres proteger)
router.post("/", guardarCoordenada);

// Listar coordenadas de un viaje
router.get("/:viajeId", authMiddleware(["admin", "conductor"]), listarCoordenadasPorViaje);

export default router;
