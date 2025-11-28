// src/server.ts
import express from "express";
import http from "http";
import cors from "cors";
import { Server as IOServer } from "socket.io";
import Coordenada from "./models/Coordenada";


import authRoutes from "./routes/auth.routes";
import usuarioRoutes from "./routes/usuario.routes";
import administradorRoutes from "./routes/administrador.routes";
import rutaRoutes from "./routes/ruta.routes";
import viajeRoutes from "./routes/viaje.route";
import busRoutes from "./routes/bus.routes";
import coordenadaRoutes from "./routes/coordenada.routes";
import esp32Routes from "./routes/esp32.routes";
import incidenteRoutes from "./routes/Incidente.routes";
import { connectToMongo } from "./database/mongo";

const app = express();
const server = http.createServer(app);

// ✅ Socket.IO SOLO para Flutter/App
const io = new IOServer(server, {
  cors: { origin: "*" }
});

const PORT = 3000;

/* ===================== MIDDLEWARES ===================== */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// ✅ Hacemos accesible Socket.IO en toda la app
app.set("io", io);

/* ===================== RUTAS ===================== */
app.use("/api/auth", authRoutes);
app.use("/api/conductor", usuarioRoutes);
app.use("/api/administrador", administradorRoutes);
app.use("/api/rutas", rutaRoutes);
app.use("/api/viaje", viajeRoutes);
app.use("/api/bus", busRoutes);
app.use("/api/coordenada", coordenadaRoutes);
app.use("/api/esp32", esp32Routes);
app.use("/api/incidente", incidenteRoutes);



// ✅ Socket.IO -> Flutter / App
io.on("connection", (socket) => {
  console.log(`📲 App conectada: ${socket.id}`);

socket.on("join_viaje", async (viajeId: string) => {
  socket.join(viajeId);
  console.log(`📡 App ${socket.id} unida al viaje ${viajeId}`);

  // Buscar la última coordenada de ese viaje
  const ultimaCoordenada = await Coordenada.findOne({ viajeId })
    .sort({ timestamp: -1 })
    .limit(1);

  if (ultimaCoordenada) {
    // Enviar solo al socket que se acaba de unir
    socket.emit("coordenada", {
      viajeId,
      esp32Id: ultimaCoordenada.esp32Id,
      latitud: ultimaCoordenada.latitud,
      longitud: ultimaCoordenada.longitud,
      timestamp: ultimaCoordenada.timestamp,
    });
  }
});

  socket.on("set_rol", (rol: string) => {
    if (rol === "admin") {
      socket.join("admin");
      console.log(`✅ Cliente ${socket.id} unido a la sala admin`);
    } else {
      console.log(`❌ Cliente ${socket.id} intentó unirse con rol ${rol}, no permitido`);
      socket.disconnect(); // opcional: puedes desconectar o simplemente ignorar
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔴 App desconectada: ${socket.id}`);
  });
});

/* ===================== START SERVER ===================== */
connectToMongo().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
    console.log("✅ WebSocket ESP32 listo");
    console.log("✅ Socket.IO Flutter listo");
  });
});
