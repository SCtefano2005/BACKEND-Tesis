import WebSocket from "ws";
import Esp32 from "../models/Esp32";
import Viaje from "../models/Viaje";
import Coordenada from "../models/Coordenada";

export const initGpsWebSocket = (server: any) => {
  const wss = new WebSocket.Server({ server });

  const esp32Cache = new Map<string, any>();
  let viajeCache: any = null;
  let lastViajeCheck = 0;

  wss.on("connection", (ws) => {
    console.log("🟢 Cliente conectado (ESP32 / Frontend)");

    let lastMessageTime = 0;

    ws.on("message", async (msg) => {
      try {
        const now = Date.now();
        if (now - lastMessageTime < 800) return; // Anti-flood (1 msg cada 800ms)
        lastMessageTime = now;

        const data = JSON.parse(msg.toString());
        const { codigo_esp32, latitud, longitud } = data;

        if (!codigo_esp32 || latitud == null || longitud == null) return;

        /* ---------------- CACHE ESP32 ---------------- */
        let esp32 = esp32Cache.get(codigo_esp32);

        if (!esp32) {
          esp32 = await Esp32.findOne({ codigo: codigo_esp32 });
          if (!esp32) {
            console.log("❌ ESP32 no registrado:", codigo_esp32);
            return;
          }
          esp32Cache.set(codigo_esp32, esp32);
        }

        /* ---------------- CACHE VIAJE ACTIVO ---------------- */
        const nowTime = Date.now();

        if (!viajeCache || nowTime - lastViajeCheck > 5000) {
          viajeCache = await Viaje.findOne({ estado: "en_curso" });
          lastViajeCheck = nowTime;
        }

        if (!viajeCache) return;

        /* ---------------- GUARDAR COORDENADA ---------------- */
        const registro = await Coordenada.create({
          viajeId: viajeCache._id,
          esp32Id: esp32._id,
          latitud,
          longitud,
          timestamp: new Date()
        });

        /* ---------------- STREAM A TODOS ---------------- */
        const payload = JSON.stringify({
          tipo: "gps_update",
          data: {
            codigo_esp32,
            latitud,
            longitud,
            viajeId: viajeCache._id,
            timestamp: registro.timestamp
          }
        });

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
          }
        });

      } catch (error) {
        console.error("❌ Error GPS WebSocket:", error);
      }
    });

    ws.on("close", () => {
      console.log("🔴 Cliente desconectado");
    });
  });

  console.log("✅ WebSocket GPS optimizado iniciado");
};
