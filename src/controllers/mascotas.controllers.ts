import { Request, Response } from "express";
import { mascotasService } from "../services/mascotas.service";

export const crearMascota = async (req: Request, res: Response) => {
  try {
    const { nombre, especie, fecha_nacimiento, id_dueno } = req.body;

    if (!nombre || !especie || !fecha_nacimiento || !id_dueno ) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const mascotaRepetida = await mascotasService.buscarPorNombreYDueno(nombre, id_dueno);
    if (mascotaRepetida) {
      return res.status(400).json({ message: "Esa mascota ya está registrada" });
    }

    const newMascota = await mascotasService.register({ nombre, especie, fecha_nacimiento, id_dueno });
    return res.status(201).json({
      message: "Mascota creada",
      mascota: newMascota
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al registrar la mascota" });
  };
};
