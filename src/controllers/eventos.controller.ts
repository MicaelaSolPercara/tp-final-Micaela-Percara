import { Request, Response } from "express";
import {
  getAllEventos,
  createEvento,
  actualizarEvento,
  eliminarEvento,
} from "../services/eventos.service";
import { CrearEventoDTO, ActualizarEventoDTO } from "../models/eventos.model";

// convierte "string | string[]" -> "string" seguro
const toStr = (value: any): string => {
  if (Array.isArray(value)) return String(value[0]);
  return String(value);
};

export const getEventos = async (req: Request, res: Response) => {
  try {
    const userId: string = toStr((req as any).user?.id);

    const eventos = await getAllEventos(userId);
    return res.json(eventos);
  } catch {
    return res.status(401).json({ message: "No autorizado" });
  }
};

export const postEvento = async (req: Request, res: Response) => {
  try {
    const userId: string = toStr((req as any).user?.id);
    const data: CrearEventoDTO = req.body;

    const nuevo = await createEvento(userId, data);
    return res.status(201).json(nuevo);
  } catch {
    return res.status(401).json({ message: "No autorizado" });
  }
};

export const patchEvento = async (req: Request, res: Response) => {
  try {
    const id: string = toStr((req as any).params?.id);
    const userId: string = toStr((req as any).user?.id);
    const datos: ActualizarEventoDTO = req.body;

    const evento = await actualizarEvento(id, userId, datos);

    if (!evento) return res.status(404).json({ message: "Evento no encontrado" });

    return res.json(evento);
  } catch {
    return res.status(401).json({ message: "No autorizado" });
  }
};

export const deleteEvento = async (req: Request, res: Response) => {
  try {
    const id: string = toStr((req as any).params?.id);
    const userId: string = toStr((req as any).user?.id);

    const eliminado = await eliminarEvento(id, userId);

    if (!eliminado) return res.status(404).json({ message: "Evento no encontrado" });

    return res.json({ message: "Evento eliminado correctamente" });
  } catch {
    return res.status(401).json({ message: "No autorizado" });
  }
};
