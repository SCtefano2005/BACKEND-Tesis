// src/services/usuario.service.ts
import bcrypt from 'bcrypt';
import Usuario, { IUsuario } from '../models/Usuario';
import Conductor from '../models/Conductor';

interface CrearUsuarioConductorPayload extends Omit<IUsuario, 'password_hash'> {
  password: string;
  conductor: {
    numero_licencia: string;
    categoria_lic: string;
    estado_conduct?: string;
    documentos?: {
      nombre: string;
      url: string;
      vence: Date;
    }[];
    experiencia?: {
      anios: number;
      historial?: string[];
    };
  };
}

export const crearUsuarioYConductor = async (data: CrearUsuarioConductorPayload) => {
  // 1. Validar duplicados
  const yaExiste = await Usuario.findOne({ identificacion: data.identificacion });
  if (yaExiste) {
    throw new Error('El usuario ya existe');
  }

  // 2. Encriptar password
  const password_hash = await bcrypt.hash(data.password, 10);

  // 3. Crear usuario
  const usuario = new Usuario({
    identificacion: data.identificacion,
    password_hash,
    rol: data.rol ?? 'conductor',
    estado: data.estado ?? 'activo',
    datos_personal: data.datos_personal,
    config_sesion: data.config_sesion ?? { notificaciones: true, tema: 'claro' },
    creado_en: new Date(),
    actualizado: new Date()
  });

  await usuario.save();

  // 4. Crear conductor asociado
  await Conductor.create({
    usuario_id: usuario._id,
    numero_licencia: data.conductor.numero_licencia,
    categoria_lic: data.conductor.categoria_lic,
    estado_conduct: data.conductor.estado_conduct ?? 'activo',
    asignaciones: [],
    documentos: data.conductor.documentos ?? [],
    experiencia: data.conductor.experiencia ?? { anios: 0 },
    creado_en: new Date(),
    actualizado: new Date()
  });

  return usuario;
};

export const buscarConductorPorDni = async (dni: string) => {
  const usuario = await Usuario.findOne({ identificacion: dni, rol: 'conductor' })
    .select('-password_hash'); // Excluir password del resultado

  if (!usuario) {
    throw new Error('Conductor no encontrado');
  }

  const conductor = await Conductor.findOne({ usuario_id: usuario._id });
  if (!conductor) {
    throw new Error('El usuario no tiene datos de conductor asociados');
  }

  return { usuario, conductor };
};


// 🔹 Editar datos de un conductor
export const editarConductor = async (
  dni: string,
  data: Partial<IUsuario> & {
    password?: string;
    conductor?: {
      numero_licencia?: string;
      categoria_lic?: string;
      estado_conduct?: string;
      documentos?: any[];
      experiencia?: { anios?: number; historial?: string[] };
    };
  }
) => {
  // 1. Buscar usuario
  const usuario = await Usuario.findOne({ identificacion: dni, rol: 'conductor' });
  if (!usuario) throw new Error('Conductor no encontrado');

  // 2. Actualizar datos de usuario
  if (data.password) {
    usuario.password_hash = await bcrypt.hash(data.password, 10);
  }
  if (data.estado) usuario.estado = data.estado;
  if (data.datos_personal) usuario.datos_personal = data.datos_personal;
  if (data.config_sesion) usuario.config_sesion = data.config_sesion;
  usuario.actualizado = new Date();

  await usuario.save();

  // 3. Actualizar datos de conductor
  if (data.conductor) {
    await Conductor.updateOne(
      { usuario_id: usuario._id },
      {
        $set: {
          ...data.conductor,
          actualizado: new Date()
        }
      }
    );
  }

  return { mensaje: 'Conductor actualizado con éxito' };
};

// 🔹 Eliminar conductor y su usuario
export const eliminarConductor = async (dni: string) => {
  const usuario = await Usuario.findOne({ identificacion: dni, rol: 'conductor' });
  if (!usuario) throw new Error('Conductor no encontrado');

  // Eliminar en paralelo usuario + conductor
  await Promise.all([
    Usuario.deleteOne({ _id: usuario._id }),
    Conductor.deleteOne({ usuario_id: usuario._id })
  ]);

  return { mensaje: 'Conductor eliminado con éxito' };
};


