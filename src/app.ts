// src/server.ts
import express from 'express';
import authRoutes from './routes/auth.routes';
import usuarioRoutes from './routes/usuario.routes'
import administradorRoutes from './routes/administrador.routes';
import http from 'http';
import cors from "cors";
import rutaRoutes from './routes/ruta.routes'
import viajeRoutes from './routes/viaje.route';
import busRoutes from './routes/bus.routes';
import esp32Routes from './routes/esp32.routes';
import { connectToMongo } from './database/mongo';
import { Server } from 'socket.io';
import coordenadaRoutes from './routes/coordenada.routes';

const app = express();
const server = http.createServer(app); // ⬅️ Necesario para Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // ⚠️ en producción pon tu dominio del front
    methods: ["GET", "POST"],
  },
});
const PORT = 3000;
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  // 💡 AÑADIR ESTA LÍNEA:
  allowedHeaders: ["Content-Type", "Authorization", "Accept"], 
}))
app.use(express.json());


// ✅ Monta rutas correctamente
app.use('/api/auth', authRoutes); // Esto usará POST /api/auth/login/conductor
app.use('/api/conductor', usuarioRoutes);
app.use('/api/administrador', administradorRoutes);
app.use('/api/rutas', rutaRoutes);
app.use('/api/viaje', viajeRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/esp32', esp32Routes);
app.use('/api/coordenada', coordenadaRoutes);

// 🔌 Conexión de sockets
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado:", socket.id);

  // Cliente solicita unirse a un viaje específico
  socket.on("join_viaje", (viajeId: string) => {
    socket.join(viajeId);
    console.log(`📡 Socket ${socket.id} unido al viaje ${viajeId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });
});


// Conexión y servidor
connectToMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
});