// src/controllers/viaje.controller.ts
import { Request, Response } from 'express';
import viajeService = require('../services/viaje.service');



/**
 * Crear un viaje
 */
export const crearViaje = async (req: Request, res: Response): Promise<void> => {
  try {
    const viaje = await viajeService.crearViaje(req.body);
    res.status(201).json(viaje);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

/**
 * Editar un viaje por ID
 */
export const editarViaje = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const viaje = await viajeService.editarViaje(id, req.body);

    if (!viaje) {
      res.status(404).json({ mensaje: 'Viaje no encontrado' });
      return;
    }

    res.json(viaje);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

/**
 * Eliminar un viaje por ID
 */
export const eliminarViaje = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const eliminado = await viajeService.eliminarViaje(id);

    if (!eliminado) {
      res.status(404).json({ mensaje: 'Viaje no encontrado' });
      return;
    }

    res.json({ mensaje: 'Viaje eliminado correctamente' });
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};



/**
 * Buscar viajes por DNI de conductor
 */
export const buscarViajesPorConductor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dni } = req.params;
    const viajes = await viajeService.buscarViajesPorConductor(dni);
    res.json(viajes);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

/**
 * Buscar viajes por placa de bus
 */
export const buscarViajesPorBus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { placa } = req.params;
    const viajes = await viajeService.buscarViajesPorBus(placa);
    res.json(viajes);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

/**
 * Buscar viajes por nombre de ruta
 */
export const buscarViajesPorRuta = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre } = req.params;
    const viajes = await viajeService.buscarViajesPorRuta(nombre);
    res.json(viajes);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

/**
 * Buscar viaje por ID
 */
export const buscarViajePorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // La variable 'viajes' contendrá un solo objeto, no un array.
    const viaje = await viajeService.buscarViajePorId(id); 
    
    // Si no se encuentra el viaje, se podría devolver 404
    if (!viaje) {
      res.status(404).json({ mensaje: 'Viaje no encontrado.' });
      return;
    }
    
    res.json(viaje); // Usar 'viaje' en singular es más claro.
  } catch (error: any) {
    // Es mejor usar 500 para errores de servidor (conexión/lógica) y no 400,
    // a menos que sepas que el ID de entrada es inválido (ej. formato).
    res.status(500).json({ mensaje: 'Error al buscar el viaje.', detalle: error.message });
  }
};

/**
 * Buscar viajes pendientes o en curso según el DNI del conductor
 */
export const getViajesPorDNI = async (req: Request, res: Response): Promise<void> => {
  const { dni, tipo } = req.params; // tipo = 'pendiente' o 'curso'

  try {
    let viajes;

    if (tipo === 'pendiente') {
      viajes = await viajeService.buscarViajesPendientesPorDNI(dni);
    } else if (tipo === 'curso') {
      viajes = await viajeService.buscarViajesEnCursoPorDNI(dni);
    } else {
      res.status(400).json({ mensaje: 'Tipo inválido. Use "pendiente" o "curso".' });
      return;
    }

    res.status(200).json(viajes);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ mensaje: error.message });
    } else {
      res.status(500).json({ mensaje: 'Error desconocido en la búsqueda de viajes.' });
    }
  }
};

export const cambiarEstadoViajeConductor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id_viaje, estado } = req.body;

    if (!id_viaje || !estado) {
      res.status(400).json({ mensaje: 'Debe enviar id_viaje y el nuevo estado.' });
      return;
    }

    const viajeActualizado = await viajeService.cambiarEstadoViajeConductor(id_viaje, estado);

    if (!viajeActualizado) {
      res.status(404).json({ mensaje: 'Viaje no encontrado.' });
      return;
    }

    res.status(200).json({
      mensaje: `Estado del viaje actualizado a "${estado}" correctamente.`,
      viaje: viajeActualizado,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ mensaje: error.message });
    } else {
      res.status(500).json({ mensaje: 'Error desconocido al cambiar el estado del viaje.' });
    }
  }


};

export const listarViajes = async (req: Request, res: Response): Promise<void> => {
  try {
    const viajes = await viajeService.listarViajes();

    if (!viajes || viajes.length === 0) {
      res.status(404).json({ mensaje: "No se encontraron viajes." });
      return;
    }

    res.status(200).json(viajes);
  } catch (error: any) {
    console.error("Error al listar viajes:", error);
    res.status(500).json({
      mensaje: "Error interno del servidor al listar viajes.",
      detalle: error.message,
    });
  }
};

export const obtenerViajesEnCurso = async (req: Request, res: Response): Promise<void> => {
  try {
    const viajes = await viajeService.listarViajeEnCurso(); // ahora sí desde el service

    if (!viajes || viajes.length === 0) {
      res.status(404).json({ mensaje: "No hay viajes en curso" });
      return;
    }

    res.status(200).json(viajes);
  } catch (error: any) {
    console.error("Error al obtener viajes en curso:", error);
    res.status(500).json({
      mensaje: "Error interno del servidor",
      detalle: error.message,
    });
  }
};
