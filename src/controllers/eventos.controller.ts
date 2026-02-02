import { Request, Response } from "express";
import { getAllEventos, createEvento } from "../services/eventos.service";

// Obtener todos los eventos
export const getEventos = (req: Request, res: Response) => {
  const eventos = getAllEventos();
  res.json(eventos);
};

// Crear un evento
export const postEvento = (req: Request, res: Response) => {
  const nuevoEvento = createEvento(req.body);
  res.status(201).json(nuevoEvento);
};

