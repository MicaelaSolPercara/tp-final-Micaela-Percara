import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";

export const createUserByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, roleId } = req.body;

    const user = await authService.register({
      name,
      email,
      password,
      roleId, 
    });

    
    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};