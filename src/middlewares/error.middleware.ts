import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("🔥 Error:", err);

  // Si el error ya trae statusCode, lo respetamos
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    message: err.message || "Error interno del servidor",
  });
};
