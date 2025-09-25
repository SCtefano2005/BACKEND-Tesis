// src/routes/administrador.routes.ts
import { Router } from 'express';
import { registrarUsuarioAdministrador } from '../controllers/administrador.controller'
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post("/administradores" ,registrarUsuarioAdministrador);

export default router;