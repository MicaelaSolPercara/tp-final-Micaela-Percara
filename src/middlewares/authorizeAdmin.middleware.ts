import { Request, Response, NextFunction } from "express";

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  const roleId = (req as any).user?.roleId;

  if (roleId !== 1) {
    return res.status(403).json({ message: "Acceso denegado: solo ADMIN" });
  }

  next();
};