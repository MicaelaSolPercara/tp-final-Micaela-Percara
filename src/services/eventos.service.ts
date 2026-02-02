import { eventos, Evento } from "../models/eventos.model";

export const listEventos = (): Evento[] => {
  return eventos;
};


export const createEvento = (data: {
  fecha: string;
  hora: string;
  descripcion: string;
  veterinario: string;
}): Evento | { error: string } => {
  const { fecha, hora, descripcion, veterinario } = data;

  if (!fecha || !hora || !descripcion || !veterinario) {
    return { error: "Faltan datos: fecha, hora, descripcion y veterinario son obligatorios" };
  }

  const newEvento: Evento = {
    id: Date.now(),
    fecha: fecha.trim(),
    hora: hora.trim(),
    descripcion: descripcion.trim(),
    veterinario: veterinario.trim(),
  };

  eventos.push(newEvento);
  return newEvento;
};
