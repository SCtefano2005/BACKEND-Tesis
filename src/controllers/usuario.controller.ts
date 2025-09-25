// src/controllers/usuario.controller.ts
import { Request, Response } from 'express';
import { crearUsuarioYConductor, buscarConductorPorDni, editarConductor, eliminarConductor } from '../services/usuario.service';

export const registrarUsuarioConductor = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuario = await crearUsuarioYConductor(req.body);
    res.status(201).json({ mensaje: 'Conductor creado con éxito', usuario });
  } catch (err) {
    console.error('❌ Error al registrar conductor:', err);
    res.status(500).json({ mensaje: (err as Error).message });
  }
};

// 🔹 Buscar conductor por DNI
export const obtenerConductorPorDni = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dni } = req.params;
    const resultado = await buscarConductorPorDni(dni);
    res.status(200).json(resultado);
  } catch (err) {
    console.error('❌ Error al buscar conductor:', err);
    res.status(404).json({ mensaje: (err as Error).message });
  }
};

// 🔹 Editar conductor por DNI
export const actualizarConductor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dni } = req.params;
    const resultado = await editarConductor(dni, req.body);
    res.status(200).json(resultado);
  } catch (err) {
    console.error('❌ Error al actualizar conductor:', err);
    res.status(500).json({ mensaje: (err as Error).message });
  }
};

// 🔹 Eliminar conductor por DNI
export const borrarConductor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dni } = req.params;
    const resultado = await eliminarConductor(dni);
    res.status(200).json(resultado);
  } catch (err) {
    console.error('❌ Error al eliminar conductor:', err);
    res.status(500).json({ mensaje: (err as Error).message });
  }
};