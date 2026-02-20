import pool from "../database/mysql";
import type { Mascotas, CrearMascota } from "./mascotas.model";

type mascotasRow = {
  id: number;
  nombre: string;
  especie: string;
  fecha_nacimeinto: Date;
  id_dueno: number;
};

export const mascotasMysqlModel = {
  buscarPorNombreYDueno: async (nombre: string, id_dueno: number): Promise<Mascotas | null> => {
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM mascotas WHERE nombre = ? AND id_dueno = ?",
      [nombre, id_dueno]
    );

    if (rows.length === 0) return null;
    return rows[0] as Mascotas;
  },

  create: async (data: CrearMascota): Promise<Mascotas> => {
    const [result] = await pool.query<any>(
      "INSERT INTO mascotas (nombre, especie, fecha_nacimiento, id_dueno) VALUES (?, ?, ?, ?)",
      [data.nombre, data.especie, data.fecha_nacimiento, data.id_dueno]
    );

    return {
      id: result.insertId,
      ...data
    };
  },

  buscarPorDueno: async (id_dueno: number): Promise<Mascotas[]> => {
    const query = "SELECT id, nombre, especie, fecha_nacimiento, id_dueno FROM mascotas WHERE id_dueno = ?";
    
    const [rows] = await pool.execute(query, [id_dueno]); 

    return rows as Mascotas[];
  },
};
