// src/services/coordenada.service.ts
import Coordenada, { ICoordenada } from "../models/Coordenada";
import Bus from "../models/Bus";
import Viaje from "../models/Viaje";
import Ruta from "../models/Ruta";
import { Request } from "express";
import Types from "mongoose";

/**
 * Guarda la coordenada enviada por un ESP32,
 * pero solo si su bus tiene un viaje en curso.
 */
export const guardarCoordenada = async (
  req: Request,
  esp32_id: string,
  latitud: number,
  longitud: number
): Promise<ICoordenada | null> => {
  // 1️⃣ Buscar el bus con ese esp32_id
  const bus = await Bus.findOne({ esp32_id });
  if (!bus) {
    console.warn(`No se encontró un bus con esp32_id ${esp32_id}`);
    return null;
  }

  // 2️⃣ Buscar si ese bus tiene un viaje en curso
  const viaje = await Viaje.findOne({
    bus_id: bus._id,
    estado: "en_curso",
  });

  if (!viaje) {
    console.log(`El bus ${bus.placa} no tiene un viaje en curso`);
    return null; // No guardamos nada
  }

  // 3️⃣ Guardar la coordenada
  const coordenada = new Coordenada({
    viajeId: viaje._id,
    esp32Id: esp32_id,
    latitud,
    longitud,
  });

  await coordenada.save();

// 4️⃣ Emitir solo a los clientes del viaje actual
  const io = req.app.get("io");
  io.to(viaje._id.toString()).emit("coordenada", {
    viajeId: viaje._id,
    esp32Id: esp32_id,
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

/**
 * Verifica los viajes en curso y emite una alerta si un bus
 * no ha enviado coordenadas en más de 3 horas.
 */
export const verificarInactividadViajesActivos = async (io?: any): Promise<void> => {
  try {
    // 1️⃣ Buscar los viajes activos y poblar bus y ruta
    const viajesActivos = await Viaje.find({ estado: "en_curso" })
      .populate<{ bus_id: { _id: Types.ObjectId; placa: string } }>("bus_id", "placa")
      .populate<{ ruta_id: { _id: Types.ObjectId; nombre: string } }>("ruta_id", "nombre");

    if (viajesActivos.length === 0) {
      console.log("No hay viajes activos para verificar.");
      return;
    }

    // 2️⃣ Revisar cada viaje activo
    for (const viaje of viajesActivos) {
      const ultimaCoordenada = await Coordenada.findOne({ viajeId: viaje._id })
        .sort({ timestamp: -1 })
        .limit(1);

      // Si no hay coordenadas registradas
      if (!ultimaCoordenada) {
        console.warn(`🚨 El viaje ${viaje._id} (${viaje.bus_id.placa}) aún no tiene coordenadas registradas.`);
        continue;
      }

      const ahora = new Date();
      const diferenciaHoras =
        (ahora.getTime() - ultimaCoordenada.timestamp.getTime()) / (1000 * 60 * 60);

      if (diferenciaHoras >= 3) {
        const placa = viaje.bus_id.placa;
        const rutaNombre = viaje.ruta_id.nombre || "Ruta sin nombre";

        const mensaje = `🚨 Alerta: El bus ${placa} (${rutaNombre}) no ha enviado coordenadas en ${diferenciaHoras.toFixed(2)} horas.`;

        console.log(mensaje);

        // 3️⃣ Si hay un socket.io activo, emitir alerta integrar con whatsapp falta
        if (io) {
          io.emit("alerta_inactividad", {
            viajeId: viaje._id,
            bus: placa,
            ruta: rutaNombre,
            horasSinDatos: diferenciaHoras.toFixed(2),
            timestamp: ahora,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error al verificar inactividad de viajes activos:", error);
  }
};