import pool from "../database/mysql";
import type { Evento } from "./eventos.model";

type EventoRow = {
  id: number;
  user_id: number;
  descripcion: string;
  veterinario: string;
  fecha: Date;
  created_at: Date;
};

export const eventosMysqlModel = {
  findAllByUserId: async (userId: number): Promise<Evento[]> => {
    const [rows] = await pool.query(
      "SELECT id, user_id, descripcion, veterinario, fecha, created_at FROM eventos WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    const typedRows = rows as EventoRow[];

    return typedRows.map((e) => ({
      id: e.id,
      userId: e.user_id,
      descripcion: e.descripcion,
      veterinario: e.veterinario,
      fecha: new Date(e.fecha).toISOString(),
      createdAt: new Date(e.created_at).toISOString(),
    }));
  },

  create: async (data: {
    userId: number;
    descripcion: string;
    veterinario: string;
    fecha: string; 
  }): Promise<Evento> => {
    const [result] = await pool.query<any>(
      "INSERT INTO eventos (user_id, descripcion, veterinario, fecha) VALUES (?, ?, ?, ?)",
      [data.userId, data.descripcion, data.veterinario, data.fecha]
    );

    return {
      id: result.insertId,
      userId: data.userId,
      descripcion: data.descripcion,
      veterinario: data.veterinario,
      fecha: data.fecha,
      createdAt: new Date().toISOString(),
    };
  },

  updateByIdAndUserId: async (data: {
    id: number;
    userId: number;
    descripcion?: string;
    veterinario?: string;
    fecha?: string; 
  }): Promise<boolean> => {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.descripcion !== undefined) {
      fields.push("descripcion = ?");
      values.push(data.descripcion);
    }
    if (data.veterinario !== undefined) {
      fields.push("veterinario = ?");
      values.push(data.veterinario);
    }
    if (data.fecha !== undefined) {
      fields.push("fecha = ?");
      values.push(data.fecha);
    }

    if (fields.length === 0) return false;

    values.push(data.id, data.userId);

    const [result] = await pool.query<any>(
      `UPDATE eventos SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`,
      values
    );

    return result.affectedRows === 1;
  },

  deleteByIdAndUserId: async (id: number, userId: number): Promise<boolean> => {
    const [result] = await pool.query<any>(
      "DELETE FROM eventos WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    return result.affectedRows === 1;
  },

  findByIdAndUserId: async (id: number, userId: number): Promise<Evento | null> => {
    const [rows] = await pool.query(
      "SELECT id, user_id, descripcion, veterinario, fecha, created_at FROM eventos WHERE id = ? AND user_id = ? LIMIT 1",
      [id, userId]
    );

    const typedRows = rows as EventoRow[];
    if (typedRows.length === 0) return null;

    const e = typedRows[0];
    return {
      id: e.id,
      userId: e.user_id,
      descripcion: e.descripcion,
      veterinario: e.veterinario,
      fecha: new Date(e.fecha).toISOString(),
      createdAt: new Date(e.created_at).toISOString(),
    };
  },
};
