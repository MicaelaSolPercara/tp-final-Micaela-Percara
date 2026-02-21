import { Request, Response, NextFunction } from "express";
import {
  getAllEventos,
  createEvento,
  actualizarEvento,
  eliminarEvento,
} from "../services/eventos.service";
import { CrearEventoDTO, ActualizarEventoDTO } from "../models/eventos.model";

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
    const roleId = (req as any).user?.roleId;
    const data: CrearEventoDTO = req.body;

    if (!userId || !roleId) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const nuevo = await createEvento(userId, roleId, data);
    return res.status(201).json(nuevo);
  } catch {
    return res.status(401).json({ message: "No autorizado" });
  }
};

export const patchEvento = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: string = toStr((req as any).params?.id);
    const userId: string = toStr((req as any).user?.id);
    const roleId = (req as any).user?.roleId;
    const datos: ActualizarEventoDTO = req.body;

    if (!userId || !roleId) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const evento = await actualizarEvento(id, userId, roleId, datos);

    if (!evento) return res.status(404).json({ message: "Evento no encontrado" });

    return res.json(evento);
  }  catch (error) {
  next(error);
};
}

export const deleteEvento = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: string = toStr((req as any).params?.id);
    const userId: string = toStr((req as any).user?.id);
    const roleId = (req as any).user?.roleId;

    if (!userId || !roleId) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const eliminado = await eliminarEvento(id, userId, roleId);

    if (!eliminado) return res.status(404).json({ message: "Evento no encontrado" });

    return res.json({ message: "Evento eliminado correctamente" });
  } catch (error) {
  next(error);
  };
}
