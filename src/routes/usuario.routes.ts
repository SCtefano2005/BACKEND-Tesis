import { Router } from 'express';
import { registrarUsuarioConductor } from '../controllers/usuario.controller';
import { validate } from '../middlewares/validate';
import { crearUsuarioSchema } from '../utils/usuario.validation';

const router = Router();

router.post('/conductores', validate(crearUsuarioSchema), registrarUsuarioConductor);

export default router;
