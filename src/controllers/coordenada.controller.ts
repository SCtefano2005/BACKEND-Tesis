// src/controllers/coordenada.controller.ts
import { Request, Response } from "express";
import * as coordenadaService from "../services/coordenada.service";

/**
 * Guardar una nueva coordenada y emitirla vía WebSocket
 */
export const guardarCoordenada = async (req: Request, res: Response): Promise<void> => {
  try {
    const { esp32_id, latitud, longitud } = req.body;

    const coordenada = await coordenadaService.guardarCoordenada(
      req,
      esp32_id,
      latitud,
      longitud
    );

    res.status(201).json(coordenada); // ✅ No devolvemos return
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

/**
 * Listar todas las coordenadas de un viaje
 */
export const listarCoordenadasPorViaje = async (req: Request, res: Response): Promise<void> => {
  try {
    const { viajeId } = req.params;

    const coordenadas = await coordenadaService.listarCoordenadasPorViaje(viajeId);

    res.json(coordenadas); // ✅ igual, solo respondemos
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};
