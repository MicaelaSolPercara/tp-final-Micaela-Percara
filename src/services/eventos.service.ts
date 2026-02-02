import { Evento, CrearEventoDTO, ActualizarEventoDTO } from "../models/eventos.model";


const eventos: Evento[] = [];


export const getAllEventos = (): Evento[] => {
  return eventos;
};

 export const createEvento = (data: CrearEventoDTO): Evento => {
  const nuevo: Evento = {
    id: eventos.length + 1,
    ...data,
  };

  eventos.push(nuevo);
  return nuevo;
};