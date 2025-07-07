// src/server.ts
import express from 'express';
import authRoutes from './routes/auth.routes';
import usuarioRoutes from './routes/usuario.routes'
import { connectToMongo } from './database/mongo';

const app = express();
const PORT = 3000;

app.use(express.json());

// ✅ Monta rutas correctamente
app.use('/api/auth', authRoutes); // Esto usará POST /api/auth/login/conductor
app.use('/api/conductor', usuarioRoutes);

// Conexión y servidor
connectToMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
});