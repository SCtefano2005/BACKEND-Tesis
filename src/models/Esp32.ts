// src/models/Esp32.ts
import { Schema, model, Document } from "mongoose";

export interface IEsp32 extends Document {
  codigo: string;        // 🔹 Identificador único (MAC address, serial o token del ESP32)
  descripcion?: string;  // Ej. "ESP32 asignado al Bus 1"
  activo: boolean;       // Estado del dispositivo
  registrado_en: Date;
  actualizado: Date;
}

const Esp32Schema = new Schema<IEsp32>({
  codigo: { type: String, required: true, unique: true },
  descripcion: { type: String },
  activo: { type: Boolean, default: true },
  registrado_en: { type: Date, default: Date.now },
  actualizado: { type: Date, default: Date.now },
});

// Middleware para actualizar `actualizado` en cada save/update
Esp32Schema.pre("save", function (next) {
  this.actualizado = new Date();
  next();
});

const Esp32 = model<IEsp32>("Esp32", Esp32Schema, "esp32");
export default Esp32;
