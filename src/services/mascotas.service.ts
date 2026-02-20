import type { Mascotas, CrearMascota } from "../models/mascotas.model";
import { mascotasMysqlModel } from "../models/mascotas.mysql.model";


//const generateId = () => Date.now().toString();

export const mascotasService = {
  buscarPorNombreYDueno: async (nombre:string, id_dueno:number) => {
  return mascotasMysqlModel.buscarPorNombreYDueno(nombre, id_dueno);
},

  register: async (data: CrearMascota): Promise<Mascotas> => {
  const mascotaRepetida = await mascotasMysqlModel.buscarPorNombreYDueno(data.nombre, data.id_dueno);
  if (mascotaRepetida) {
    throw new Error("La mascota ya está registrada");
  }

  return await mascotasMysqlModel.create(data);
},

};