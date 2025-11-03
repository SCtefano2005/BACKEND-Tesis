// src/controllers/viaje.controller.ts
import { Request, Response } from 'express';
import * as viajeService from '../services/viaje.service';

/**
 * Crear un viaje
 */
export const crearViaje = async (req: Request, res: Response): Promise<void> => {
  try {
    const viaje = await viajeService.crearViaje(req.body);
    res.status(201).json(viaje);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

/**
 * Editar un viaje por ID
 */
export const editarViaje = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const viaje = await viajeService.editarViaje(id, req.body);

    if (!viaje) {
      res.status(404).json({ mensaje: 'Viaje no encontrado' });
      return;
    }

    res.json(viaje);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

/**
 * Eliminar un viaje por ID
 */
export const eliminarViaje = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const eliminado = await viajeService.eliminarViaje(id);

    if (!eliminado) {
      res.status(404).json({ mensaje: 'Viaje no encontrado' });
      return;
    }

    res.json({ mensaje: 'Viaje eliminado correctamente' });
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

/**
 * Listar todos los viajes
 */
export const listarViajes = async (req: Request, res: Response): Promise<void> => {
  try {
    const viajes = await viajeService.listarViajes();
    res.json(viajes);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

/**
 * Buscar viajes por DNI de conductor
 */
export const buscarViajesPorConductor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dni } = req.params;
    const viajes = await viajeService.buscarViajesPorConductor(dni);
    res.json(viajes);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

/**
 * Buscar viajes por placa de bus
 */
export const buscarViajesPorBus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { placa } = req.params;
    const viajes = await viajeService.buscarViajesPorBus(placa);
    res.json(viajes);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

/**
 * Buscar viajes por nombre de ruta
 */
export const buscarViajesPorRuta = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre } = req.params;
    const viajes = await viajeService.buscarViajesPorRuta(nombre);
    res.json(viajes);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

/**
 * Buscar viaje por ID
 */
export const buscarViajePorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // La variable 'viajes' contendrá un solo objeto, no un array.
    const viaje = await viajeService.buscarViajePorId(id); 
    
    // Si no se encuentra el viaje, se podría devolver 404
    if (!viaje) {
      res.status(404).json({ mensaje: 'Viaje no encontrado.' });
      return;
    }
    
    res.json(viaje); // Usar 'viaje' en singular es más claro.
  } catch (error: any) {
    // Es mejor usar 500 para errores de servidor (conexión/lógica) y no 400,
    // a menos que sepas que el ID de entrada es inválido (ej. formato).
    res.status(500).json({ mensaje: 'Error al buscar el viaje.', detalle: error.message });
  }
};
