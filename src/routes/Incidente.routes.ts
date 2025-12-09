//src/routes/Incidente.routes.ts

import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { crearIncidenteController, obtenerIncidentesController, obtenerIncidentesPorConductorController, 
    eliminarIncidenteController,obtenerIncidenteporIdController, actualizarEstadoController } from "../controllers/Incidente.controller";

const router = Router();


router.post("/create", authMiddleware(["conductor"]), crearIncidenteController);
router.get("/", authMiddleware(["admin"]), obtenerIncidentesController);
router.get("/conductor/:dni", authMiddleware(["admin", "conductor"]), obtenerIncidentesPorConductorController);
router.delete("/:id", authMiddleware(["admin"]), eliminarIncidenteController);
router.get("/get/:id", authMiddleware(["admin"]), obtenerIncidenteporIdController);
router.post("/cambiarestado", authMiddleware(["admin"]), actualizarEstadoController);

export default router;