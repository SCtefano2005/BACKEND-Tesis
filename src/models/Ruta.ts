
// src/models/Ruta.ts
import { Schema, model, Document } from 'mongoose';

export interface IParadero {
  nombre: string;
  orden: number;
}

export interface IRuta extends Document {
  nombre: string;
  paraderos: IParadero[];
}

const ParaderoSchema = new Schema<IParadero>(
  {
    nombre: { type: String, required: true },
    orden: { type: Number, required: true },
  },
  { _id: false }
);

const RutaSchema = new Schema<IRuta>(
  {
    nombre: { type: String, required: true, unique: true },
    paraderos: [ParaderoSchema],
  },
  { collection: 'rutas' }
);

export default model<IRuta>('Ruta', RutaSchema);
