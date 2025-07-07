import Joi from 'joi';

export const crearUsuarioSchema = Joi.object({
  identificacion: Joi.string().min(6).required(),
  password: Joi.string().min(6).required(),
  rol: Joi.string().valid('admin', 'conductor', 'pasajero').required(),
  estado: Joi.string().valid('activo', 'inactivo', 'baneado').default('activo'),
  datos_personal: Joi.object({
    nombres: Joi.string().required(),
    apellidos: Joi.string().required(),
    email: Joi.string().email().required(),
    telefono: Joi.string().optional(),
    direccion: Joi.string().optional()
  }).required(),
  config_sesion: Joi.object({
    notificaciones: Joi.boolean().optional(),
    tema: Joi.string().valid('claro', 'oscuro').optional()
  }).optional(),
  conductor: Joi.object({
    numero_licencia: Joi.string().required(),
    categoria_lic: Joi.string().required(),
    estado_conduct: Joi.string().valid('activo', 'inactivo', 'suspendido'),
    documentos: Joi.array().items(
      Joi.object({
        nombre: Joi.string().required(),
        url: Joi.string().uri().required(),
        vence: Joi.date().optional()
      })
    ),
    experiencia: Joi.object({
      anios: Joi.number().min(0).required(),
      historial: Joi.array().items(Joi.string())
    }).optional()
  }).required()
});
