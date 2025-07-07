// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import Usuario from '../models/Usuario';
import Conductor from '../models/Conductor';
import bcrypt from 'bcrypt';

export const loginConductor = async (req: Request, res: Response): Promise<void> => {
  const { identificacion, password } = req.body;

  if (!identificacion || !password) {
    res.status(400).json({ mensaje: 'Faltan credenciales' });
    return;
  }

  try {
    const resultado = await authService.loginConductor(identificacion, password);
    res.status(200).json(resultado);
  } catch (err: any) {
    res.status(401).json({ mensaje: err.message });
  }
};

export const verificarIdentidadConductor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identificacion, numero_licencia } = req.body;

    // Validar entrada
    if (!identificacion || !numero_licencia) {
      res.status(400).json({ mensaje: 'Faltan datos requeridos' });
      return;
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({ identificacion });
    if (!usuario) {
      res.json({ valido: false });
      return;
    }

    // Buscar conductor
    const conductor = await Conductor.findOne({
      usuario_id: usuario._id,
      numero_licencia
    });

    // Respuesta final
    res.json({ valido: !!conductor });
    
  } catch (err) {
    console.error('❌ Error al verificar identidad:', err);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

export const restablecerContrasena = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identificacion, nuevaPassword } = req.body;
    
    // Validar entrada
    if (!identificacion || !nuevaPassword) {
      res.status(400).json({ mensaje: 'Faltan datos requeridos' });
      return;
    }
    
    // Validar longitud de contraseña
    if (nuevaPassword.length < 6) {
      res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }
    
    // Buscar usuario
    const usuario = await Usuario.findOne({ identificacion });
    if (!usuario) {
      res.status(404).json({ mensaje: 'Usuario no encontrado' });
      return;
    }
    
    // Actualizar contraseña
    const nuevaHash = await bcrypt.hash(nuevaPassword, 10);
    usuario.password_hash = nuevaHash;
    usuario.actualizado = new Date();
    await usuario.save();
    
    res.json({ mensaje: 'Contraseña actualizada correctamente' });
    
  } catch (err) {
    console.error('❌ Error al restablecer contraseña:', err);
    res.status(500).json({ mensaje: 'Error al actualizar contraseña' });
  }
};