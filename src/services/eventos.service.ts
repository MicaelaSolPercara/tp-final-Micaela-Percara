import { EventoMongo } from "../models/evento.mongo.model";
import { CrearEventoDTO, ActualizarEventoDTO } from "../models/eventos.model";

// GET /api/eventos
export const getAllEventos = async (userId: string) => {
  return EventoMongo.find({ userId }).sort({ createdAt: -1 });
};

// POST /api/eventos
export const createEvento = async (userId: string, data: CrearEventoDTO) => {
  return EventoMongo.create({ ...data, userId });
};

// PATCH /api/eventos/:id  ✅ id ES STRING
export const actualizarEvento = async (
  id: string,
  userId: string,
  datos: ActualizarEventoDTO
) => {
  return EventoMongo.findOneAndUpdate(
    { _id: id, userId },
    { $set: datos },
    { new: true }
  );
};

// DELETE /api/eventos/:id ✅ id ES STRING
export const eliminarEvento = async (id: string, userId: string) => {
  const res = await EventoMongo.deleteOne({ _id: id, userId });
  return res.deletedCount === 1;
};
