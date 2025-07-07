// src/services/usuario.service.ts
import Usuario, { IUsuario } from '../models/Usuario';
import Conductor from '../models/Conductor';

interface CrearUsuarioConductorPayload extends Partial<IUsuario> {
  password: string;
  conductor?: {
    numero_licencia: string;
    categoria_lic: string;
    estado_conduct?: string;
    documentos?: any[];
    experiencia?: {
      anios: number;
      historial?: string[];
    };
  };
}

export const crearUsuarioYConductor = async (data: CrearUsuarioConductorPayload) => {
  const { conductor: conductorData, ...usuarioData } = data;

  const yaExiste = await Usuario.findOne({ identificacion: usuarioData.identificacion });
  if (yaExiste) throw new Error('El usuario ya existe');

  const usuario = new Usuario({
    ...usuarioData,
    password_hash: data.password
  });

  await usuario.save();

  if (usuario.rol === 'conductor') {
    if (!conductorData) throw new Error('Datos de conductor requeridos');

    await Conductor.create({
      usuario_id: usuario._id,
      numero_licencia: conductorData.numero_licencia,
      categoria_lic: conductorData.categoria_lic,
      estado_conduct: conductorData.estado_conduct ?? 'activo',
      documentos: conductorData.documentos ?? [],
      experiencia: conductorData.experiencia ?? { anios: 0 }
    });
  }

  return usuario;
};