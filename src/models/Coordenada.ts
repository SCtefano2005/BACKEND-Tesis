// src/models/Coordenada.ts
import { Schema, model, Document, Types } from "mongoose";

export interface ICoordenada extends Document {
  viajeId: Types.ObjectId;   // 🔗 Relación con Viaje
  latitud: number;
  longitud: number;
  timestamp: Date;           // Cuándo se recibió la coordenada
}

const CoordenadaSchema = new Schema<ICoordenada>({
  viajeId: { type: Schema.Types.ObjectId, ref: "Viaje", required: true },
  latitud: { type: Number, required: true },
  longitud: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default model<ICoordenada>("Coordenada", CoordenadaSchema, "coordenadas");
