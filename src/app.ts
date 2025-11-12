// src/server.ts
import express from 'express';
import http from 'http';
import cors from "cors";
import { Server } from 'socket.io';

import authRoutes from './routes/auth.routes';
import usuarioRoutes from './routes/usuario.routes';
import administradorRoutes from './routes/administrador.routes';
import rutaRoutes from './routes/ruta.routes';
import viajeRoutes from './routes/viaje.route';
import busRoutes from './routes/bus.routes';
import coordenadaRoutes from './routes/coordenada.routes';
import esp32Routes from './routes/esp32.routes';
import { connectToMongo } from './database/mongo';

const app = express();
const server = http.createServer(app); // ✅ Necesario para Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // ⚠️ Cambia esto a tu dominio Flutter en producción
    methods: ["GET", "POST"],
  },
});

const PORT = 3000;

// ✅ Middlewares
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));
app.use(express.json());

// ✅ Guardamos `io` en la app (para usarlo en controladores)
app.set("io", io);

// ✅ Rutas
app.use('/api/auth', authRoutes);
app.use('/api/conductor', usuarioRoutes);
app.use('/api/administrador', administradorRoutes);
app.use('/api/rutas', rutaRoutes);
app.use('/api/viaje', viajeRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/coordenada', coordenadaRoutes);
app.use('/api/esp32', esp32Routes);

// ✅ WebSocket (Socket.IO)
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado:", socket.id);

  // Cliente se une a un viaje
  socket.on("join_viaje", (viajeId: string) => {
    socket.join(viajeId);
    console.log(`📡 Socket ${socket.id} unido al viaje ${viajeId}`);
  });

  // Cliente desconectado
  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });
});

// ✅ Conectar a MongoDB y arrancar servidor HTTP (no app.listen)
connectToMongo().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
});
