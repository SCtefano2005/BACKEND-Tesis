// src/routes/esp32.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { crearEsp32,editarEsp32, eliminarEsp32, buscarEsp32PorCodigo, buscarEsp32Porid } from "../controllers/esp32.controller";

const router = Router();

router.post("/crear", authMiddleware(['admin']), crearEsp32);
router.put("/:id", authMiddleware(["admin"]), editarEsp32);
router.delete("/:id", authMiddleware(["admin"]), eliminarEsp32);
router.get("/:codigo", authMiddleware(["admin"]), buscarEsp32PorCodigo);
router.get("/:id", authMiddleware(["admin"]), buscarEsp32Porid);

export default router;
