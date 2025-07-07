import Usuario from '../models/Usuario';
import Conductor from '../models/Conductor';
import bcrypt from 'bcrypt';
import { generarToken } from '../utils/jwt';

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
