// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  uid: string;
  rol: string;
}

export const authMiddleware =
  (roles: string[] = []) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Token requerido');

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;

      if (roles.length && !roles.includes(decoded.rol)) {
        return res.status(403).json({ mensaje: 'No autorizado' });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ mensaje: 'Token inválido' });
    }
  };
