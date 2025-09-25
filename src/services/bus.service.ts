// src/services/bus.service.ts
import Bus, { IBus } from '../models/Bus';

/**
 * Crear un nuevo bus
 */
export const crearBus = async (data: Partial<IBus>): Promise<IBus> => {
  const existe = await Bus.findOne({ placa: data.placa });
  if (existe) {
    throw new Error('Ya existe un bus con esta placa');
  }

  const nuevoBus = new Bus({
    placa: data.placa,
    modelo: data.modelo,
    anno: data.anno,
    soat: data.soat,
    esp32_id: data.esp32_id,
    creado_en: new Date(),
    actualizado: new Date(),
  });

  return await nuevoBus.save();
};

/**
 * Buscar un bus por su placa
 */
export const buscarBusPorPlaca = async (placa: string): Promise<IBus | null> => {
  return await Bus.findOne({ placa });
};

/**
 * Editar bus por placa
 */
export const editarBus = async (
  placa: string,
  updates: Partial<IBus>
): Promise<IBus | null> => {
  const bus = await Bus.findOneAndUpdate(
    { placa },
    { ...updates, actualizado: new Date() },
    { new: true }
  );

  return bus;
};

/**
 * Eliminar un bus por placa
 */
export const eliminarBus = async (placa: string): Promise<IBus | null> => {
  return await Bus.findOneAndDelete({ placa });
};
