import { eventosMysqlModel } from "../models/eventos.mysql.model";
import type { CrearEventoDTO, ActualizarEventoDTO } from "../models/eventos.model";

const toMysqlDateTime = (fecha: string, hora: string) => `${fecha} ${hora}:00`;

export const getAllEventos = async (userId: string, roleId:number) => {
  const uid = Number (userId);
   if (roleId === 1) return eventosMysqlModel.findAll();          // admin
  if (roleId === 2) return eventosMysqlModel.findAllByVetId(uid); // vet
  return eventosMysqlModel.findAllByUserId(uid); //dueño
};

export const createEvento = async (userId: string, roleId: number, data: CrearEventoDTO) => {
  if (roleId === 3) {
    throw new Error("No tienes permisos para crear eventos (turnos)");
  }

  return eventosMysqlModel.create({
    userId: Number(userId),
    mascotaId: data.mascotaId,
    veterinarioId: data.veterinarioId,
    descripcion: data.descripcion,
    fecha: toMysqlDateTime(data.fecha, data.hora),
  });
};

export const actualizarEvento = async (
  id: string,
  userId: string,
  roleId: number,
  datos: ActualizarEventoDTO
) => {
  if (roleId === 3) {
    throw new Error("No tienes permisos para modificar turnos");
  }

  const updateData: any = {
    id: Number(id),
    userId: Number(userId),
    roleId: roleId,
  };

  if (datos.mascotaId !== undefined) updateData.mascotaId = datos.mascotaId;
  if (datos.veterinarioId !== undefined) updateData.veterinarioId = datos.veterinarioId;
  if (datos.descripcion !== undefined) updateData.descripcion = datos.descripcion;

  if (datos.fecha && datos.hora) {
    updateData.fecha = toMysqlDateTime(datos.fecha, datos.hora);
  }

  const updated = await eventosMysqlModel.updateByIdAndUserId(updateData);
  if (!updated) return null;

  // ✅ 2 args (como define el mysql model)
  return eventosMysqlModel.findByIdAndUserId(Number(id), Number(userId), roleId);
};

export const eliminarEvento = async (id: string, userId: string, roleId: number) => {
  return eventosMysqlModel.deleteByIdAndUserId(Number(id), Number(userId), roleId);
};