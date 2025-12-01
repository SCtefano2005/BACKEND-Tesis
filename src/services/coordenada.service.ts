// src/services/coordenada.service.ts
import Coordenada, { ICoordenada } from "../models/Coordenada";
import Bus from "../models/Bus";
import Viaje from "../models/Viaje";

import { Request } from "express";
import Types from "mongoose";
import Esp32 from "../models/Esp32";

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
  // 1️⃣ Buscar Esp32 por codigo
  const esp32 = await Esp32.findOne({
    codigo: esp32_id,
  });
  if (!esp32) {
    console.error('No existe el esp32 ');
    return null;
  }
  // Busca el bus con el campo _id obtenido del objeto esp32
  const bus = await Bus.findOne({
    esp32_id: esp32?._id.toString()
  });
  if (!bus) {
    console.error('No hay ningun bus asociado a ese esp32');
    return null;
  }

  // 2️⃣ Buscar si ese bus tiene un viaje en curso
  const viaje = await Viaje.findOne({
    bus_id: bus?._id,
    estado: "en-curso",
  });

  if (!viaje) {
    console.log(`El bus ${bus?.placa} no tiene un viaje en curso`);
    return null; // No guardamos nada
  }

  // 3️⃣ Guardar la coordenada
  const coordenada = new Coordenada({
    viajeId: viaje._id,
    esp32Id: esp32._id,
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
    timestamp: coordenada.timestamp.toLocaleString("es-PE", { timeZone: "America/Lima" }),
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
    const viajesActivos = await Viaje.find({ estado: "en_curso" })
      .populate<{ bus_id: { _id: Types.ObjectId; placa: string } }>("bus_id", "placa")
      .populate<{ ruta_id: { _id: Types.ObjectId; nombre: string } }>("ruta_id", "nombre");

    if (viajesActivos.length === 0) {
      console.log("No hay viajes activos para verificar.");
      return;
    }

    for (const viaje of viajesActivos) {
      const ultimaCoordenada = await Coordenada.findOne({ viajeId: viaje._id })
        .sort({ timestamp: -1 })
        .limit(1);

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

        // 🔐 Emitir solo a la sala "admin"
        if (io) {
          io.to("admin").emit("alerta_inactividad", {
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
