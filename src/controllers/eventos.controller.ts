import { Request, Response } from "express";
import { getAllEventos, createEvento } from "../services/eventos.service";

// Obtener todos los eventos
export const getEventos = (req: Request, res: Response) => {
 const userId = (req as any).user.id; 

  const eventos = getAllEventos(userId);
  res.json(eventos);
};

// Crear un evento
export const postEvento = (req: Request, res: Response) => {
 const userId = (req as any).user.id;

  const nuevoEvento = createEvento({ ...req.body, userId });

  res.status(201).json(nuevoEvento);
};

