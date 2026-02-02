// Evento (Turnos veterinaria)
export interface Evento {
  id: number;
  fecha: string;
  hora: string;
  descripcion: string;
  veterinario: string;
}

export const eventos: Evento[] = [];
