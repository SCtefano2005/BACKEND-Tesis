// src/services/viaje.service.ts
import Viaje, { IViaje } from '../models/Viaje';
import Conductor from '../models/Conductor';
import Usuario from '../models/Usuario';
import Bus from '../models/Bus';
import Ruta from '../models/Ruta';

/**
 * Crear un viaje
 */
/* Crear un viaje */
export const crearViaje = async (data: {
  creador_email: string;
  conductor_dni: string;
  bus_placa: string;
  ruta_nombre: string;
  origen: string;
  destino: string;
  fecha_salida: Date;
  fecha_llegada: Date;
}): Promise<IViaje> => {
  // 🔎 Buscar admin por email dentro de datos_personal
  const admin = await Usuario.findOne({
    'datos_personal.email': data.creador_email,
    rol: 'admin',
  });
  if (!admin) throw new Error('Administrador no encontrado');

  // 🔎 Buscar conductor por DNI
  const usuario = await Usuario.findOne({ identificacion: data.conductor_dni });
  if (!usuario) throw new Error('Conductor no encontrado');

  // 🔎 Buscar bus por placa
  const bus = await Bus.findOne({ placa: data.bus_placa });
  if (!bus) throw new Error('Bus no encontrado');

  // 🔎 Buscar ruta por nombre
  const ruta = await Ruta.findOne({ nombre: data.ruta_nombre });
  if (!ruta) throw new Error('Ruta no encontrada');

  // 🚍 Crear viaje
  const viaje = new Viaje({
    creado_por: admin._id,
    conductor_id: usuario._id,
    bus_id: bus._id,
    ruta_id: ruta._id,
    origen: data.origen,
    destino: data.destino,
    fecha_salida: data.fecha_salida,
    fecha_llegada: data.fecha_llegada,
    estado: 'pendiente',
  });

  return await viaje.save();
};

/**
 * Editar un viaje
 */
export const editarViaje = async (
  id: string,
  data: Partial<IViaje>
): Promise<IViaje | null> => {
  return await Viaje.findByIdAndUpdate(id, data, { new: true })
    .populate('conductor_id')
    .populate('bus_id')
    .populate('ruta_id')
    .populate('creado_por');
};

/**
 * Eliminar un viaje
 */
export const eliminarViaje = async (id: string): Promise<boolean> => {
  const result = await Viaje.findByIdAndDelete(id);
  return !!result;
};

/**
 * Buscar viajes por DNI de conductor
 */
export const buscarViajesPorConductor = async (dni: string): Promise<IViaje[]> => {
  const usuario = await Usuario.findOne({ identificacion: dni });
  if (!usuario) throw new Error('Conductor no encontrado');

  return await Viaje.find({ conductor_id: usuario._id })
    .populate('conductor_id')
    .populate('bus_id')
    .populate('ruta_id')
    .populate('creado_por');
};

/**
 * Buscar viajes por placa de bus
 */
export const buscarViajesPorBus = async (placa: string): Promise<IViaje[]> => {
  const bus = await Bus.findOne({ placa });
  if (!bus) throw new Error('Bus no encontrado');

  return await Viaje.find({ bus_id: bus._id })
    .populate('conductor_id')
    .populate('bus_id')
    .populate('ruta_id')
    .populate('creado_por');
};

/**
 * Buscar viajes por ruta
 */
export const buscarViajesPorRuta = async (nombre: string): Promise<IViaje[]> => {
  const ruta = await Ruta.findOne({ nombre });
  if (!ruta) throw new Error('Ruta no encontrada');

  return await Viaje.find({ ruta_id: ruta._id })
    .populate('conductor_id')
    .populate('bus_id')
    .populate('ruta_id')
    .populate('creado_por');
};

/**
 * Listar todos los viajes
 */
export const listarViajes = async () => {
  return await Viaje.find()
    .populate('conductor_id')
    .populate('bus_id')
    .populate('ruta_id')
    .populate('creado_por');
};

/**
 * Buscar viaje por ID
 */
export const buscarViajePorId = async (id: string) => {
  return await Viaje.findById(id)
    .populate('conductor_id')
    .populate('bus_id')
    .populate('ruta_id')
    .populate('creado_por');
};

/**
 * Busca los viajes con estado "pendiente" de un conductor según su DNI.
 */
export const buscarViajesPendientesPorDNI = async (dni: string) => {
  try {
    // Buscar al conductor por su identificación
    const conductor = await Usuario.findOne({ identificacion: dni, rol: 'conductor' });

    if (!conductor) {
      throw new Error('No se encontró un conductor con ese DNI.');
    }

    // Buscar los viajes pendientes de ese conductor
    const viajesPendientes = await Viaje.find({
      conductor_id: conductor._id,
      estado: 'pendiente'
    })
      .populate('bus_id')
      .populate('ruta_id')
      .populate('conductor_id', 'datos_personal')
      .populate('creado_por', 'datos_personal')
      .exec();

    return viajesPendientes;
  } catch (error) {
    console.error('Error al buscar viajes pendientes:', error);
    throw error;
  }
};

/**
 * Busca los viajes con estado "en curso" de un conductor según su DNI.
 */
export const buscarViajesEnCursoPorDNI = async (dni: string) => {
  try {
    const conductor = await Usuario.findOne({ identificacion: dni, rol: 'conductor' });

    if (!conductor) {
      throw new Error('No se encontró un conductor con ese DNI.');
    }

    const viajesEnCurso = await Viaje.find({
      conductor_id: conductor._id,
      estado: 'en curso'
    })
      .populate('bus_id')
      .populate('ruta_id')
      .populate('conductor_id', 'datos_personal')
      .populate('creado_por', 'datos_personal')
      .exec();

    return viajesEnCurso;
  } catch (error) {
    console.error('Error al buscar viajes en curso:', error);
    throw error;
  }
};

export const cambiarEstadoViajeConductor = async (id_viaje: string, nuevoEstado: string) => {
  try {
    const viajeActualizado = await Viaje.findByIdAndUpdate(
      id_viaje,
      { estado: nuevoEstado, actualizado: new Date() },
      { new: true } // Devuelve el documento actualizado
    ).populate('conductor_id', 'datos_personal')
     .populate('bus_id')
     .populate('ruta_id')
     .populate('creado_por', 'datos_personal')
     .exec();

    return viajeActualizado;
  } catch (error) {
    console.error('Error al cambiar el estado del viaje:', error);
    throw error;
  }
};