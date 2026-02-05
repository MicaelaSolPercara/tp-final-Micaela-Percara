import { Schema, model, Types } from "mongoose";

const eventoSchema = new Schema(
  {
    fecha: { type: String, required: true },
    hora: { type: String, required: true },
    descripcion: { type: String, required: true },
    veterinario: { type: String, required: true },

    userId: { type: String, required: true },
  },
  { timestamps: true }
);

export const EventoMongo = model("Evento", eventoSchema);
