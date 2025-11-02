// src/models/Conductor.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface Documento {
  nombre: string;
  url: string;
  vence?: Date;
}

export interface Experiencia {
  anios: number;
  historial?: string[];
}

export interface IConductor extends Document {
  usuario_id: Types.ObjectId;
  numero_licencia: string;
  categoria_lic: string;
  estado_conduct: 'activo' | 'inactivo' | 'suspendido';
  documentos?: Documento[];
  experiencia?: Experiencia;
  creado_en?: Date;
  actualizado?: Date;
}

const ConductorSchema = new Schema<IConductor>(
  {
    usuario_id: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true, unique: true },
    numero_licencia: { type: String, required: true },
    categoria_lic: { type: String, required: true },
    estado_conduct: {
      type: String,
      enum: ['activo', 'inactivo', 'suspendido'],
      default: 'activo',
    },
    documentos: [
      {
        nombre: { type: String, required: true },
        url: { type: String, required: true },
        vence: { type: Date },
      },
    ],
    experiencia: {
      anios: { type: Number, min: 0, required: true },
      historial: [String],
    },
  },
  {
    timestamps: { createdAt: 'creado_en', updatedAt: 'actualizado' },
    collection: 'conductores' // 👈 ESPECIFICACIÓN CLAVE
  }
);

export default model<IConductor>('Conductor', ConductorSchema);
