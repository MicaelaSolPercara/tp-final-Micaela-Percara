import { Request, Response } from "express";
import * as eventosService from "../services/eventos.service";

export const list = (_req: Request, res: Response) => {
  const data = eventosService.listEventos();
  res.json(data);
};

export const create = (req: Request, res: Response) => {
  const { fecha, hora, descripcion, veterinario } = req.body;

  const result = eventosService.createEvento({ fecha, hora, descripcion, veterinario });

  if ("error" in result) {
    return res.status(400).json(result);
  }

  return res.status(201).json(result);
};
