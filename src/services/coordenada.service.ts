// src/services/coordenada.service.ts
import Coordenada, { ICoordenada } from "../models/Coordenada";
import Esp32 from "../models/Esp32";
import Viaje from "../models/Viaje";
import { Request } from "express";

/**
 * Guardar coordenada en un viaje
 * y emitirla en tiempo real vía WebSocket
 */
export const guardarCoordenada = async (
  req: Request,
  viajeId: string,
  esp32_id: string,
  latitud: number,
  longitud: number
): Promise<ICoordenada> => {
  // Verificar ESP32
  const esp32 = await Esp32.findOne({ codigo: esp32_id });
  if (!esp32) throw new Error("ESP32 no encontrado");

  // Verificar Viaje
  const viaje = await Viaje.findById(viajeId);
  if (!viaje) throw new Error("Viaje no encontrado");

  // Guardar en Mongo
  const coordenada = new Coordenada({
    viajeId: viaje._id,
    esp32Id: esp32._id,
    latitud,
    longitud,
  });

  await coordenada.save();

  // Emitir por WebSocket
  const io = req.app.get("io"); // recuperamos io del server
  io.emit(`viaje:${viajeId}:coordenada`, {
    viajeId,
    esp32Id: esp32._id,
    latitud,
    longitud,
    timestamp: coordenada.timestamp,
  });

  return coordenada;
};

/**
 * Listar todas las coordenadas de un viaje
 */
export const listarCoordenadasPorViaje = async (
  viajeId: string
): Promise<ICoordenada[]> => {
  return await Coordenada.find({ viajeId }).sort({ timestamp: 1 });
};
