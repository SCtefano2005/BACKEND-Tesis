// src/models/Viaje.ts
import { Schema, model, Document, Types } from "mongoose";

export interface IViaje extends Document {
  _id: Types.ObjectId;                 // ✅ Explicitamos el tipo del ID
  creado_por: Types.ObjectId;          // Admin que programa el viaje
  conductor_id: Types.ObjectId;        // Conductor asignado
  bus_id: Types.ObjectId;              // Bus asignado
  ruta_id: Types.ObjectId;             // Ruta asignada
  origen: string;
  destino: string;
  fecha_salida: Date;
  fecha_llegada: Date;
  estado: "pendiente" | "en_curso" | "finalizado" | "cancelado";
  creado_en?: Date;
  actualizado?: Date;
}

const ViajeSchema = new Schema<IViaje>(
  {
    creado_por: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    conductor_id: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    bus_id: {
      type: Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    ruta_id: {
      type: Schema.Types.ObjectId,
      ref: "Ruta",
      required: true,
    },
    origen: { type: String, required: true },
    destino: { type: String, required: true },
    fecha_salida: { type: Date, required: true },
    fecha_llegada: { type: Date, required: true },
    estado: {
      type: String,
      enum: ["pendiente", "en_curso", "finalizado", "cancelado"],
      default: "pendiente",
    },
  },
  {
    timestamps: { createdAt: "creado_en", updatedAt: "actualizado" },
    collection: "viajes",
  }
);

// 💡 Agregamos un índice útil para buscar viajes activos rápidamente
ViajeSchema.index({ bus_id: 1, estado: 1 });

export default model<IViaje>("Viaje", ViajeSchema);
