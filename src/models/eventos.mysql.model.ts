import pool from "../database/mysql";
import type { Evento } from "./eventos.model";

type EventoRow = {
  id: number;
  user_id: number;
  mascotaId: number | null;
  veterinarioId: number | null;
  descripcion: string | null;
  fecha: Date;
  created_at: Date;
};

export const eventosMysqlModel = {
  // ADMIN: trae todos los eventos
  findAll: async (): Promise<Evento[]> => {
    const [rows] = await pool.query(
      `SELECT 
         id,
         user_id,
         mascota_id AS mascotaId,
         veterinario_id AS veterinarioId,
         descripcion,
         fecha,
         created_at
       FROM eventos
       ORDER BY created_at DESC`
    );

    const typedRows = rows as EventoRow[];

    return typedRows.map((e) => ({
      id: e.id,
      userId: e.user_id,
      mascotaId: Number(e.mascotaId ?? 0),
      veterinarioId: Number(e.veterinarioId ?? 0),
      descripcion: e.descripcion ?? "",
      fecha: new Date(e.fecha).toISOString(),
      createdAt: new Date(e.created_at).toISOString(),
    }));
  },

  // VET: trae eventos donde el veterinario es el usuario logueado
  findAllByVetId: async (vetId: number): Promise<Evento[]> => {
    const [rows] = await pool.query(
      `SELECT 
         id,
         user_id,
         mascota_id AS mascotaId,
         veterinario_id AS veterinarioId,
         descripcion,
         fecha,
         created_at
       FROM eventos
       WHERE veterinario_id = ?
       ORDER BY created_at DESC`,
      [vetId]
    );

    const typedRows = rows as EventoRow[];

    return typedRows.map((e) => ({
      id: e.id,
      userId: e.user_id,
      mascotaId: Number(e.mascotaId ?? 0),
      veterinarioId: Number(e.veterinarioId ?? 0),
      descripcion: e.descripcion ?? "",
      fecha: new Date(e.fecha).toISOString(),
      createdAt: new Date(e.created_at).toISOString(),
    }));
  },

  findAllByUserId: async (userId: number): Promise<Evento[]> => {
    const [rows] = await pool.query(
      `SELECT 
         id,
         user_id,
         mascota_id AS mascotaId,
         veterinario_id AS veterinarioId,
         descripcion,
         fecha,
         created_at
       FROM eventos
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    const typedRows = rows as EventoRow[];

    return typedRows.map((e) => ({
  id: e.id,
  userId: e.user_id,
  mascotaId: Number(e.mascotaId ?? 0),
  veterinarioId: Number(e.veterinarioId ?? 0),
  descripcion: e.descripcion ?? "",
  fecha: new Date(e.fecha).toISOString(),
  createdAt: new Date(e.created_at).toISOString(),
}));
  },

  create: async (data: {
    userId: number;
    mascotaId: number;
    veterinarioId: number;
    descripcion: string;
    fecha: string; // "YYYY-MM-DD HH:mm:ss" o ISO, tu service lo arma
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

  async updateByIdAndUserId(data: {
    id: number;
    userId: number;
    roleId: number;
    mascotaId?: number;
    veterinarioId?: number;
    descripcion?: string;
    fecha?: string; // "YYYY-MM-DD HH:mm:ss"
  }) {
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
    if (data.roleId === 3) return false;

    let sql = `UPDATE eventos SET ${fields.join(", ")} WHERE id = ?`;
    values.push(data.id);

    // Si NO es admin, solo puede editar sus eventos
    if (data.roleId !== 1) {
      sql += ` AND user_id = ?`;
      values.push(data.userId);
    }

    const [result]: any = await pool.query(sql, values);
    return result.affectedRows > 0;
  },

  deleteByIdAndUserId: async (id: number, userId: number, roleId: number): Promise<boolean> => {
    // dueños no deberían borrar, pero por las dudas:
    if (roleId === 3) return false;

    let query = "DELETE FROM eventos WHERE id = ?";
    const params: any[] = [id];

    // si NO es admin, solo borra sus eventos
    if (roleId !== 1) {
      query += " AND user_id = ?";
      params.push(userId);
    }

    const [result] = await pool.query<any>(query, params);
    return result.affectedRows === 1;
  },

  findByIdAndUserId: async (id: number, userId: number, roleId?: number): Promise<Evento | null> => {
    // Si es admin, puede buscar cualquier evento por id.
    const isAdmin = roleId === 1;

    const [rows] = await pool.query(
      `SELECT
         id,
         user_id,
         mascota_id AS mascotaId,
         veterinario_id AS veterinarioId,
         descripcion,
         fecha,
         created_at
       FROM eventos
       WHERE id = ?
       ${isAdmin ? "" : "AND user_id = ?"}
       LIMIT 1`,
      isAdmin ? [id] : [id, userId]
    );

    const typedRows = rows as EventoRow[];
    if (typedRows.length === 0) return null;

    const e = typedRows[0];
    return {
      id: e.id,
      userId: e.user_id,
     mascotaId: Number(e.mascotaId ?? 0),
      veterinarioId: Number(e.veterinarioId ?? 0),
      descripcion: e.descripcion ?? "",
      fecha: new Date(e.fecha).toISOString(),
      createdAt: new Date(e.created_at).toISOString(),
    };
  },
};
