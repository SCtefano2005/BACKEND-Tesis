// src/routes/auth.routes.ts
import { Router } from 'express';
import { loginConductor, verificarIdentidadConductor, restablecerContrasena } from '../controllers/auth.controller';

const router = Router();

router.post('/login/conductor', loginConductor);
router.post('/verification-credentials', verificarIdentidadConductor);
router.put('/recovery-password', restablecerContrasena)

export default router;
