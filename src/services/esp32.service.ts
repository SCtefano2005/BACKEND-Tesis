// src/services/esp32.service.ts
import Esp32, { IEsp32 } from "../models/Esp32";

/**
 * Crear un nuevo ESP32
 */
export const crearEsp32 = async (data: Partial<IEsp32>): Promise<IEsp32> => {
  try {
    const nuevoEsp32 = new Esp32(data);
    return await nuevoEsp32.save();
  } catch (error: any) {
    throw new Error(`Error al crear ESP32: ${error.message}`);
  }
};

/**
 * Obtener todos los ESP32
 */
export const listarEsp32 = async (): Promise<IEsp32[]> => {
  try {
    return await Esp32.find();
  } catch (error: any) {
    throw new Error(`Error al listar ESP32: ${error.message}`);
  }
};

/**
 * Buscar ESP32 por código único
 */
export const buscarEsp32PorCodigo = async (codigo: string): Promise<IEsp32 | null> => {
  try {
    return await Esp32.findOne({ codigo });
  } catch (error: any) {
    throw new Error(`Error al buscar ESP32 por código: ${error.message}`);
  }
};

/**
 * Buscar ESP32 por código único
 */
export const buscarEsp32PorId = async (id: string): Promise<IEsp32 | null> => {
  try {
    return await Esp32.findById(id); // Busca por _id de Mongo
  } catch (error: any) {
    throw new Error(`Error al buscar ESP32 por id: ${error.message}`);
  }
};
/**
 * Editar un ESP32 por ID
 */
export const editarEsp32 = async (id: string, data: Partial<IEsp32>): Promise<IEsp32 | null> => {
  try {
    return await Esp32.findByIdAndUpdate(id, data, { new: true });
  } catch (error: any) {
    throw new Error(`Error al editar ESP32: ${error.message}`);
  }
};

/**
 * Eliminar un ESP32 por ID
 */
export const eliminarEsp32 = async (id: string): Promise<boolean> => {
  try {
    const eliminado = await Esp32.findByIdAndDelete(id);
    return !!eliminado;
  } catch (error: any) {
    throw new Error(`Error al eliminar ESP32: ${error.message}`);
  }
};
