import pool from "../database/mysql";
import type { Evento } from "./eventos.model";

type EventoRow = {
  id: number;
  user_id: number;
  mascotaId: number;
  veterinarioId: number;
  descripcion: string;
  fecha: Date;
  created_at: Date;
};

export const eventosMysqlModel = {
  findAllByUserId: async (userId: number): Promise<Evento[]> => {
    const [rows] = await pool.query(
      "SELECT id, user_id, mascota_id, veterinario_id, descripcion, fecha, created_at FROM eventos WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    const typedRows = rows as EventoRow[];

    return typedRows.map((e) => ({
      id: e.id,
      userId: e.user_id,
      mascotaId: e.mascotaId,
      veterinarioId: e.veterinarioId,
      descripcion: e.descripcion,
      fecha: new Date(e.fecha).toISOString(),
      createdAt: new Date(e.created_at).toISOString(),
    }));
  },

  create: async (data: {
    userId: number;
    mascotaId: number;
    veterinarioId: number;
    descripcion: string;
    fecha: string; 
  }): Promise<Evento> => {
    const [result] = await pool.query<any>(
      "INSERT INTO eventos (user_id, mascota_id, veterinario_id, descripcion, fecha) VALUES (?, ?, ?, ?, ?)",
      [data.userId, data.mascotaId, data.veterinarioId, data.descripcion, data.fecha]
    );

    return {
      id: result.insertId,
      ...data,
      createdAt: new Date().toISOString(),
    };
  },

  updateByIdAndUserId: async (data: {
    id: number;
    userId: number;
    roleId: number,
    mascotaId?: number;
    veterinarioId?: number;
    descripcion?: string;
    fecha?: string; 
  }): Promise<boolean> => {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.mascotaId !== undefined) {
      fields.push("mascota_id = ?");
      values.push(data.mascotaId);
    }

    if (data.veterinarioId !== undefined) {
      fields.push("veterinario_id = ?");
      values.push(data.veterinarioId);
    }
    
    if (data.descripcion !== undefined) {
      fields.push("descripcion = ?");
      values.push(data.descripcion);
    }
    
    if (data.fecha !== undefined) {
      fields.push("fecha = ?");
      values.push(data.fecha);
    }

    if (fields.length === 0) return false;

    let query = `UPDATE eventos SET ${fields.join(", ")} WHERE id = ?`;
  values.push(data.id);

  if (data.roleId === 3) {
    query += " AND user_id = ?";
    values.push(data.userId);
  }

  const [result] = await pool.query<any>(query, values);
  return result.affectedRows === 1;
},

   
  deleteByIdAndUserId: async (id: number, userId: number, roleId: number): Promise<boolean> => {
    let query = "DELETE FROM eventos WHERE id = ?";
    let params = [id];

  if (roleId === 3) {
      query += " AND user_id = ?";
      params.push(userId);
    }
  else {
    query = "DELETE FROM eventos WHERE id = ?";
    params = [id];
  }
    
   const [result] = await pool.query<any>(query, params);
    return result.affectedRows === 1;
  },

  findByIdAndUserId: async (id: number, userId: number): Promise<Evento | null> => {
    const [rows] = await pool.query(
      "SELECT id, user_id, mascota_id, veterinario_id, descripcion, veterinario, fecha, created_at FROM eventos WHERE id = ? AND user_id = ? LIMIT 1",
      [id, userId]
    );

    const typedRows = rows as EventoRow[];
    if (typedRows.length === 0) return null;

    const e = typedRows[0];
    return {
      id: e.id,
      userId: e.user_id,
      mascotaId: e.mascotaId,
      veterinarioId: e.veterinarioId,
      descripcion: e.descripcion,
      fecha: new Date(e.fecha).toISOString(),
      createdAt: new Date(e.created_at).toISOString(),
    };
  },
};
