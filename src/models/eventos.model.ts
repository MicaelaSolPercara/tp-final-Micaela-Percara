// Evento (Turnos veterinaria)
export interface Evento {
  id: number;
  fecha: string;
  hora: string;
  descripcion: string;
  veterinario: string;
}

export interface CrearEventoDTO {
  fecha: string;
  hora: string;
  descripcion: string;
  veterinario: string;
}

export interface ActualizarEventoDTO {
  fecha?: string;
  hora?: string;
  descripcion?: string;
  veterinario?: string;
}