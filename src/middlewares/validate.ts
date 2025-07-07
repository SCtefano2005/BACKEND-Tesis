import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate =
  (schema: Joi.ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction): void | Promise<void> => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(400).json({
        mensaje: 'Validación fallida',
        detalles: error.details.map(d => d.message)
      });
      return;
    }
    return next();      // ✔ nada que devolver, solo continuar
  };
