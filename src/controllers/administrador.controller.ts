import { Request, Response } from 'express';
import { crearUsuarioYAdministrador } from '../services/administrador.service'

export const registrarUsuarioAdministrador = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario = await crearUsuarioYAdministrador(req.body);
    res.status(201).json({ mensaje: 'Conductor creado con éxito', usuario });
  } catch (err) {
    console.error('❌ Error al registrar conductor:', err);
    res.status(500).json({ mensaje: (err as Error).message });
  }
};
