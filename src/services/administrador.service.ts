// src/services/administrador.service.ts

import Usuario, { IUsuario } from '../models/Usuario';
import Administrador, { IAdministrador } from '../models/Administrador';
import bcrypt from 'bcrypt';

interface CrearUsuarioAdministradorPayload extends Omit<IUsuario, "password_hash"> {
  password: string;
  administrador: {
    permisos: string[];
    area: string;
    nivel?: "superadmin" | "admin_local";
  };
}

export const crearUsuarioYAdministrador = async (data: CrearUsuarioAdministradorPayload) => {
  // 1. Validar duplicados
  const yaExiste = await Usuario.findOne({ identificacion: data.identificacion });
  if (yaExiste) {
    throw new Error("El usuario ya existe");
  }

  // 2. Encriptar password
  const password_hash = await bcrypt.hash(data.password, 10);

  // 3. Crear usuario
  const usuario = new Usuario({
    identificacion: data.identificacion,
    password_hash,
    rol: data.rol ?? "administrador",
    estado: data.estado ?? "activo",
    datos_personal: data.datos_personal,
    config_sesion: data.config_sesion ?? { notificaciones: true, tema: "claro" },
    creado_en: new Date(),
    actualizado: new Date()
  });

  await usuario.save();

  // 4. Crear administrador asociado
  const admin = new Administrador({
    usuario_id: usuario._id,
    permisos: data.administrador.permisos,
    area: data.administrador.area,
    nivel: data.administrador.nivel ?? "admin_local",
    creado_en: new Date(),
    actualizado: new Date()
  });

  await admin.save();

  return { usuario, admin };
};