import { eventosMysqlModel } from "../models/eventos.mysql.model";
import type { CrearEventoDTO, ActualizarEventoDTO } from "../models/eventos.model";

const toMysqlDateTime = (fecha: string, hora: string) => `${fecha} ${hora}:00`;

export const getAllEventos = async (userId: string) => {
  return eventosMysqlModel.findAllByUserId(Number(userId));
};

export const createEvento = async (userId: string, data: CrearEventoDTO) => {
  return eventosMysqlModel.create({
    userId: Number(userId),
    descripcion: data.descripcion,
    veterinario: data.veterinario,
    fecha: toMysqlDateTime(data.fecha, data.hora),
  });
};

export const actualizarEvento = async (
  id: string,
  userId: string,
  datos: ActualizarEventoDTO
) => {
  const updateData: any = {
    id: Number(id),
    userId: Number(userId),
  };

  if (datos.descripcion !== undefined) updateData.descripcion = datos.descripcion;
  if (datos.veterinario !== undefined) updateData.veterinario = datos.veterinario;

  if (datos.fecha && datos.hora) {
    updateData.fecha = toMysqlDateTime(datos.fecha, datos.hora);
  }

  const updated = await eventosMysqlModel.updateByIdAndUserId(updateData);

  if (!updated) return null;

  return eventosMysqlModel.findByIdAndUserId(Number(id), Number(userId));
};

export const eliminarEvento = async (id: string, userId: string) => {
  return eventosMysqlModel.deleteByIdAndUserId(Number(id), Number(userId));
};
