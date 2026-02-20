export interface Mascotas {
  id: number;
  nombre: string;
  especie: string;
  fecha_nacimiento: Date;
  id_dueno: number  
}

export interface CrearMascota {
  nombre: string;
  especie: string;
  fecha_nacimiento: Date;
  id_dueno: number 
}

