import { Request, Response } from "express";
import {
  crearIncidente,
  obtenerIncidentes,
  obtenerIncidentesPorConductor,
  eliminarIncidente,
  obtenerIncidenteporId,
  actualizarestado
} from "../services/Incidente.service";

//crear
export const crearIncidenteController = async (req: Request, res: Response) => {
  try {
    const data = req.body; // dni + datos del incidente

    const resultado = await crearIncidente(data);

    res.status(201).json(resultado);

  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

//listar todos
export const obtenerIncidentesController = async (req: Request, res: Response) => {
  try {
    const lista = await obtenerIncidentes();

    res.status(200).json(lista);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//obtener por DNI
export const obtenerIncidentesPorConductorController = async (req: Request, res: Response) => {
  try {
    const { dni } = req.params;

    const incidentes = await obtenerIncidentesPorConductor(dni);

    res.status(200).json(incidentes);

  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

//Eliminar Incidente
export const eliminarIncidenteController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await eliminarIncidente(id);

    res.status(200).json({ mensaje: "Incidente eliminado correctamente" });

  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};


// Obtener incidente por ID
export const obtenerIncidenteporIdController = async (req : Request, res: Response) => {
  try {
    console.log("ID recibido:", req.params.id); // 👈 imprime el ID
    const incidente = await obtenerIncidenteporId(req.params.id);
    res.json(incidente);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

// Actualizar estado de un incidente
export const actualizarEstadoController = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const { estado } = req.body;

    const resultado = await actualizarestado(id, estado);

    res.status(200).json(resultado); // devuelve mensaje de confirmación
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

