import pool from "../database/mysql";
import type { User } from "./users.model";

type UserRow = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: "ADMIN" | "VET";
  created_at: Date;
};

export const usersMysqlModel = {
  findByEmail: async (email: string): Promise<User | null> => {
    const [rows] = await pool.query(
      "SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    const typedRows = rows as UserRow[];

    if (typedRows.length === 0) return null;

    const u = typedRows[0];
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      passwordHash: u.password_hash,
      role: u.role,
      createdAt: new Date(u.created_at),
    };
  },

  create: async (data: {
    name: string;
    email: string;
    passwordHash: string;
    role: "ADMIN" | "VET";
  }): Promise<User> => {
    const [result] = await pool.query<any>(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [data.name, data.email, data.passwordHash, data.role]
    );

    const newUser: User = {
      id: result.insertId,
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role,
      createdAt: new Date(),
    };

    return newUser;
  },
};
