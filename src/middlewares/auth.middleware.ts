// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  uid: string;
  rol: string;
}

export const authMiddleware =
  (roles: string[] = []) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        res.status(401).json({ mensaje: 'Token requerido' });
        return; // 🔑 corta ejecución
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;

      if (roles.length && !roles.includes(decoded.rol)) {
        res.status(403).json({ mensaje: 'No autorizado' });
        return;
      }

      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ mensaje: 'Token inválido' });
    }
  };
