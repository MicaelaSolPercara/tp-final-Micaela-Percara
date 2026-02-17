import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const existing = await authService.findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Ese email ya está registrado" });
    }

    const newUser = await authService.register({ name, email, password });

    return res.status(201).json({
      message: "Usuario creado",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const token = await authService.login(email, password);

    return res.status(200).json({ token });
  } catch (error: any) {
    if (error?.message === "Credenciales inválidas") {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    return res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

