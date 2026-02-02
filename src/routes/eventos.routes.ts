import { Router } from "express";
import { getEventos, postEvento } from "../controllers/eventos.controller";

const router = Router();

// GET /eventos → traer todos los eventos
router.get("/", getEventos);

// POST /eventos → crear un evento
router.post("/", postEvento);

export default router;

