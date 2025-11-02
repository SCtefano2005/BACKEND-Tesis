// src/controllers/bus.controller.ts
import { Request, Response } from 'express';
import * as busService from '../services/bus.service';

// ✅ Crear bus
export const crearBus = async (req: Request, res: Response): Promise<void> => {
  try {
    const bus = await busService.crearBus(req.body);
    res.status(201).json({ mensaje: 'Bus creado con éxito', bus });
  } catch (err: any) {
    res.status(400).json({ mensaje: err.message });
  }
};

// ✅ Buscar bus por placa
export const buscarBusPorPlaca = async (req: Request, res: Response): Promise<void> => {
  try {
    const { placa } = req.params;
    const bus = await busService.buscarBusPorPlaca(placa);
    if (!bus) {
      res.status(404).json({ mensaje: 'Bus no encontrado' });
      return;
    }
    res.json(bus);
  } catch (err: any) {
    res.status(500).json({ mensaje: err.message });
  }
};

/**
 * Obtener un bus por su ID
 */
export const obtenerBusPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const bus = await busService.buscarBusPorId(id);

    if (!bus) {
      res.status(404).json({ mensaje: '❌ Bus no encontrado' });
      return;
    }

    res.status(200).json(bus);
  } catch (err: any) {
    console.error('❌ Error al buscar bus por ID:', err);
    res.status(500).json({ mensaje: err.message || 'Error interno del servidor' });
  }
};

// ✅ Editar bus
export const editarBus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { placa } = req.params;
    const bus = await busService.editarBus(placa, req.body);
    if (!bus) {
      res.status(404).json({ mensaje: 'Bus no encontrado' });
      return;
    }
    res.json({ mensaje: 'Bus actualizado con éxito', bus });
  } catch (err: any) {
    res.status(400).json({ mensaje: err.message });
  }
};

// ✅ Eliminar bus
export const eliminarBus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { placa } = req.params;
    const bus = await busService.eliminarBus(placa);
    if (!bus) {
      res.status(404).json({ mensaje: 'Bus no encontrado' });
      return;
    }
    res.json({ mensaje: 'Bus eliminado con éxito' });
  } catch (err: any) {
    res.status(500).json({ mensaje: err.message });
  }
};
