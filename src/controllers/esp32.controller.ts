// src/controllers/esp32.controller.ts
import { Request, Response } from "express";
import * as esp32Service from "../services/esp32.service";

/**
 * Crear un nuevo ESP32
 */
export const crearEsp32 = async (req: Request, res: Response): Promise<void> => {
  try {
    const esp32 = await esp32Service.crearEsp32(req.body);
    res.status(201).json(esp32);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

/**
 * Listar todos los ESP32
 */
export const listarEsp32 = async (req: Request, res: Response): Promise<void> => {
  try {
    const esp32List = await esp32Service.listarEsp32();
    res.json(esp32List);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

/**
 * Buscar un ESP32 por código
 */
export const buscarEsp32PorCodigo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { codigo } = req.params;
    const esp32 = await esp32Service.buscarEsp32PorCodigo(codigo);
    if (!esp32) {
      res.status(404).json({ mensaje: "ESP32 no encontrado" });
      return;
    }
    res.json(esp32);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

/**
 * Editar un ESP32 por ID
 */
export const editarEsp32 = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const esp32 = await esp32Service.editarEsp32(id, req.body);
    if (!esp32) {
      res.status(404).json({ mensaje: "ESP32 no encontrado" });
      return;
    }
    res.json(esp32);
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};

/**
 * Eliminar un ESP32 por ID
 */
export const eliminarEsp32 = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const eliminado = await esp32Service.eliminarEsp32(id);
    if (!eliminado) {
      res.status(404).json({ mensaje: "ESP32 no encontrado" });
      return;
    }
    res.json({ mensaje: "ESP32 eliminado correctamente" });
  } catch (error: any) {
    res.status(400).json({ mensaje: error.message });
  }
};
