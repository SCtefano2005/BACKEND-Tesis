import { Request, Response } from 'express';
import { getDb } from '../database/mongo';
import bcrypt from 'bcrypt';

export const registrarUsuarioConductor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      identificacion,
      password,
      rol,
      estado,
      datos_personal,
      config_sesion,
      conductor
    } = req.body;

    const password_hash = await bcrypt.hash(password, 10);
    const db = getDb();
    if (!db) {
      res.status(500).json({ mensaje: 'Error de conexión con la base de datos' });
      return;
    }

    // 1. Crear usuario
    const usuarioLimpio = {
      identificacion,
      password_hash,
      rol,
      estado,
      datos_personal,
      config_sesion,
      creado_en: new Date(),
      actualizado: new Date()
    };

    const { insertedId: usuarioId } = await db.collection('usuarios').insertOne(usuarioLimpio);

    // 2. Crear conductor asociado
    const conductorLimpio: any = {
      usuario_id: usuarioId,
      numero_licencia: conductor.numero_licencia,
      categoria_lic: conductor.categoria_lic,
      estado_conduct: conductor.estado_conduct ?? 'activo',
      asignaciones: [],
      creado_en: new Date(),
      actualizado: new Date()
    };

    // Agrega solo si existe
    if (Array.isArray(conductor.documentos)) {
      conductorLimpio.documentos = conductor.documentos;
    }

    if (conductor.experiencia && typeof conductor.experiencia === 'object') {
      conductorLimpio.experiencia = conductor.experiencia;
    }

    await db.collection('conductores').insertOne(conductorLimpio);

    res.status(201).json({ mensaje: 'Conductor creado con éxito' });
  } catch (err) {
    console.error('❌ Error al registrar conductor:', err);
    res.status(500).json({ mensaje: 'Error interno al registrar conductor' });
  }
};
