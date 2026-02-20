// Evento (Turnos veterinaria)
export interface Evento {
  id: number;
  userId: number;
  mascotaId: number;
  veterinarioId: number;
  fecha: string;
  createdAt: string;
  descripcion: string;
}

export interface CrearEventoDTO {
  fecha: string;
  hora: string;
  descripcion: string;
  mascotaId: number;
  veterinarioId: number;
}

export interface ActualizarEventoDTO {
  fecha?: string;
  hora?: string;
  descripcion?: string;
  mascotaId?: number;
  veterinarioId?: number;
}