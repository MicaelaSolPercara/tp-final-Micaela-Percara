// src/services/eventos.service.ts

import { Evento } from "../models/eventos.model";

const eventos: Evento[] = [];

export const getAllEventos = (userId: string): Evento[] => {
  return eventos.filter((e) => e.userId === userId);
};

export const createEvento = (data: Omit<Evento, "id">): Evento => {
  const nuevoEvento: Evento = {
    id: Date.now(),
    ...data,
  };

  eventos.push(nuevoEvento);
  return nuevoEvento;
};
