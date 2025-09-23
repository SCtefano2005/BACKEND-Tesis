import Usuario from '../models/Usuario';
import Conductor from '../models/Conductor';
import bcrypt from 'bcrypt';
import { generarToken } from '../utils/jwt';
import Administrador from '../models/Administrador';


export const loginConductor = async (identificacion: string, password: string) => {
  const usuario = await Usuario.findOne({ identificacion });

  if (!usuario) throw new Error('Usuario no encontrado');
  if (usuario.rol !== 'conductor') throw new Error('No autorizado');

  const passwordOk = await bcrypt.compare(password, usuario.password_hash);
  if (!passwordOk) throw new Error('Contraseña incorrecta');

  const conductor = await Conductor.findOne({ usuario_id: usuario._id });
  if (!conductor) throw new Error('Conductor no registrado en sistema');

  const token = generarToken({
    uid: usuario._id,
    rol: usuario.rol
  });

  return {
    token,
    perfil: {
      id: usuario._id,
      identificacion: usuario.identificacion,
      nombres: usuario.datos_personal.nombres,
      apellidos: usuario.datos_personal.apellidos,
      email: usuario.datos_personal.email
    }
  };
};

export const loginAdministrador = async (email: string, password: string) => {
  // 1. Buscar usuario por email
  const usuario = await Usuario.findOne({ "datos_oersonal.email":email });
  if (!usuario) throw new Error('Usuario no encontrado');

  // 2. Validar que sea administrador
  if (usuario.rol !== 'admin') {
    throw new Error('No autorizado: este usuario no es administrador');
  }

  // 3. Validar contraseña
  const passwordOk = await bcrypt.compare(password, usuario.password_hash);
  if (!passwordOk) throw new Error('Contraseña incorrecta');

  // 4. Verificar datos de administrador
  const admin = await Administrador.findOne({ usuario_id: usuario._id });
  if (!admin) throw new Error('Administrador no registrado en sistema');

  // 5. Generar token JWT
  const token = generarToken({
    uid: usuario._id,
    rol: usuario.rol,
    nivel: admin.nivel,   // 🔹 ahora incluimos el nivel del admin
    permisos: admin.permisos // 🔹 se incluyen permisos para el frontend
  });

  // 6. Retornar datos completos
  return {
    token,
    perfil: {
      id: usuario._id,
      identificacion: usuario.identificacion,
      nombres: usuario.datos_personal.nombres,
      apellidos: usuario.datos_personal.apellidos,
      email: usuario.datos_personal.email,
      area: admin.area,
      nivel: admin.nivel,
      permisos: admin.permisos
    }
  };
};

