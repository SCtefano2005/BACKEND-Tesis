// src/models/Usuario.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface DatosPersonal {
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  direccion?: string;
}

export interface ConfigSesion {
  notificaciones?: boolean;
  tema?: 'claro' | 'oscuro';
}

export interface IUsuario extends Document {
  identificacion: string;
  password_hash: string;
  rol: 'admin' | 'conductor' | 'pasajero' | 'tecnico';
  estado: 'activo' | 'inactivo' | 'baneado';
  datos_personal: DatosPersonal;
  config_sesion?: ConfigSesion;
  creado_en?: Date;
  actualizado?: Date;
  checkPassword(password: string): Promise<boolean>;
}

const UsuarioSchema = new Schema<IUsuario>(
  {
    identificacion: {
      type: String,
      required: true,
      minlength: 6,
      match: /^[A-Z0-9-]+$/,
      unique: true,
    },
    password_hash: { type: String, required: true },
    rol: {
      type: String,
      enum: ['admin', 'conductor', 'pasajero', 'tecnico'],
      required: true,
    },
    estado: {
      type: String,
      enum: ['activo', 'inactivo', 'baneado'],
      default: 'activo',
    },
    datos_personal: {
      nombres: { type: String, required: true },
      apellidos: { type: String, required: true },
      email: { type: String, required: true, match: /^\S+@\S+\.\S+$/ },
      telefono: { type: String },
      direccion: { type: String },
    },
    config_sesion: {
      notificaciones: Boolean,
      tema: { type: String, enum: ['claro', 'oscuro'] },
    },
  },
  {
    timestamps: { createdAt: 'creado_en', updatedAt: 'actualizado' },
    strict: true,
  }
);

UsuarioSchema.methods.checkPassword = async function (
  this: IUsuario,
  password: string
): Promise<boolean> {
  const bcrypt = require('bcrypt');
  return bcrypt.compare(password, this.password_hash);
};

export default mongoose.model<IUsuario>('Usuario', UsuarioSchema);
