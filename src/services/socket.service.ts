// src/socket.ts
import { Server } from "socket.io";
import Coordenada from "../models/Coordenada";
import Viaje from "../models/Viaje";

export const socketHandler = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("🟢 Cliente conectado:", socket.id);

    // 📍 Cuando el conductor envía su ubicación
    socket.on("enviar_coordenada", async (data) => {
      const { viajeId, latitud, longitud } = data;

      if (!viajeId || latitud == null || longitud == null) {
        console.warn("⚠️ Datos incompletos:", data);
        return;
      }

      try {
        // 1️⃣ Verificar si el viaje está en curso
        const viaje = await Viaje.findById(viajeId);
        if (!viaje || viaje.estado !== "en_curso") {
          console.log(`🚫 Viaje ${viajeId} no está en curso`);
          return;
        }

        // 2️⃣ Guardar coordenada
        const coordenada = new Coordenada({
          viajeId,
          latitud,
          longitud,
        });
        await coordenada.save();

        // 3️⃣ Emitir a todos los clientes conectados al viaje
        io.to(viajeId.toString()).emit("coordenada", {
          viajeId,
          latitud,
          longitud,
          timestamp: coordenada.timestamp,
        });

        console.log(`✅ Coordenada guardada y enviada (${latitud}, ${longitud})`);
      } catch (err) {
        console.error("❌ Error al guardar coordenada:", err);
      }
    });

    // 👥 Los clientes (por ejemplo, los supervisores o pasajeros) se unen al viaje
    socket.on("unirse_viaje", (viajeId) => {
      socket.join(viajeId);
      console.log(`👥 Cliente ${socket.id} unido al viaje ${viajeId}`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Cliente desconectado:", socket.id);
    });
  });
};
