// src/services/ruta.service.ts
import Ruta, { IRuta } from '../models/Ruta';

/**
 * Crear una nueva ruta
 */
export const crearRuta = async (datos: Partial<IRuta>) => {
  try {
    const nuevaRuta = new Ruta(datos);
    return await nuevaRuta.save();
  } catch (error: any) {
    throw new Error(`Error al crear la ruta: ${error.message}`);
  }
};

/**
 * Editar ruta por ID
 */
export const editarRuta = async (id: string, datos: Partial<IRuta>) => {
  try {
    const ruta = await Ruta.findByIdAndUpdate(id, datos, { new: true });
    if (!ruta) throw new Error('Ruta no encontrada');
    return ruta;
  } catch (error: any) {
    throw new Error(`Error al editar la ruta: ${error.message}`);
  }
};

/**
 * Buscar todas las rutas o por nombre
 */
export const buscarRutas = async (nombre?: string) => {
  try {
    if (nombre) {
      return await Ruta.findOne({ nombre });
    }
    return await Ruta.find();
  } catch (error: any) {
    throw new Error(`Error al buscar rutas: ${error.message}`);
  }
};


/**
 * Buscar ruta por ID
 */
export const buscarRutaPorId = async (id: string) => {
  try {
    const ruta = await Ruta.findById(id);
    return ruta; // retorna null si no existe
  } catch (error: any) {
    throw new Error(`Error al buscar ruta por ID: ${error.message}`);
  }
};

/**
 * Eliminar ruta por ID
 */
export const eliminarRuta = async (id: string) => {
  try {
    const ruta = await Ruta.findByIdAndDelete(id);
    if (!ruta) throw new Error('Ruta no encontrada');
    return { mensaje: 'Ruta eliminada correctamente' };
  } catch (error: any) {
    throw new Error(`Error al eliminar la ruta: ${error.message}`);
  }
};
