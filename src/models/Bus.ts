// src/models/Bus.ts
import { Schema, model, Document } from 'mongoose';

export interface IBus extends Document {
  placa: string;
  modelo: string;
  anno: number;
  soat: {
    numero: string;
    vence: Date;
  };
  esp32_id: string;   // 🔹 ID único del ESP32 que controla/monitorea el bus
  creado_en: Date;
  actualizado: Date;
}

const BusSchema = new Schema<IBus>({
  placa: { type: String, required: true, unique: true },
  modelo: { type: String, required: true },
  anno: { type: Number, required: true },
  soat: {
    numero: { type: String, required: true },
    vence: { type: Date, required: true },
  },
  esp32_id: { type: String, required: true, unique: true },
  creado_en: { type: Date, default: Date.now },
  actualizado: { type: Date, default: Date.now },
});

// Middleware para actualizar `actualizado` en cada save
BusSchema.pre("save", function (next) {
  this.actualizado = new Date();
  next();
});

export default model<IBus>("Bus", BusSchema, "buses");
