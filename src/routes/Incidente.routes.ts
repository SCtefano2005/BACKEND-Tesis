//src/routes/Incidente.routes.ts

import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { crearIncidenteController, obtenerIncidentesController, obtenerIncidentesPorConductorController, 
    eliminarIncidenteController } from "../controllers/Incidente.controller";

const router = Router();


router.post("/create", authMiddleware(["conductor"]), crearIncidenteController);
router.get("/", authMiddleware(["admin"]), obtenerIncidentesController);
router.get("/conductor/:dni", authMiddleware(["admin", "conductor"]), obtenerIncidentesPorConductorController);
router.delete("/:id", authMiddleware(["admin"]), eliminarIncidenteController);

export default router;