// src/controllers/ruta.controller.ts
import { Request, Response } from 'express';
import * as rutaService from '../services/ruta.service';

/**
 * Crear una nueva ruta
 */
export const crearRuta = async (req: Request, res: Response) => {
  try {
    const ruta = await rutaService.crearRuta(req.body);
    res.status(201).json(ruta);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

/**
 * Editar ruta por ID
 */
export const editarRuta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ruta = await rutaService.editarRuta(id, req.body);
    res.json(ruta);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

/**
 * Buscar rutas (todas o por nombre)
 */
export const buscarRutas = async (req: Request, res: Response) => {
  try {
    const { nombre } = req.query;
    const rutas = await rutaService.buscarRutas(nombre as string | undefined);
    res.json(rutas);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

export const buscarRutaPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const ruta = await rutaService.buscarRutaPorId(id);

    if (!ruta) {
      res.status(404).json({ mensaje: 'Ruta no encontrada' });
      return;
    }

    res.status(200).json(ruta);
  } catch (error: any) {
    console.error('Error al buscar ruta por ID:', error);
    res.status(500).json({ mensaje: error.message });
  }
};

/**
 * Eliminar ruta por ID
 */
export const eliminarRuta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resultado = await rutaService.eliminarRuta(id);
    res.json(resultado);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};
