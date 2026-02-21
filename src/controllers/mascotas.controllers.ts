import { Request, Response } from "express";
import { mascotasService } from "../services/mascotas.service";

export const crearMascota = async (req: Request, res: Response) => {
  try {
    const { nombre, especie, fecha_nacimiento, id_dueno } = req.body;

    if (!nombre || !especie || !fecha_nacimiento || !id_dueno) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

   const nuevaMascota = await mascotasService.register({nombre, 
        especie, 
        fecha_nacimiento, 
        id_dueno});
    
    return res.status(201).json({
        message: "Mascota creada con éxito",
        mascota: nuevaMascota
    });

  } catch (error: any) {
    
    if (error.message === "La mascota ya está registrada") {
      return res.status(409).json({ message: error.message });
    }
    
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getMascotas = async (req: Request, res: Response) => {
  try {
    const id_dueno = (req as any).user?.id;

    if (!id_dueno) {
      return res.status(401).json({ message: "No autorizado: No se encontró el ID de usuario" });
    }

    const listaMascotas = await mascotasService.obtenerPorDueno(Number(id_dueno));

    return res.status(200).json(listaMascotas);

  } catch (error) {
    console.error("Error en getMascotas:", error);
    return res.status(500).json({ message: "Error al obtener la lista de mascotas" });
  }
};

   

