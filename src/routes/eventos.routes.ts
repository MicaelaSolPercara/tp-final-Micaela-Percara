import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { getEventos, postEvento } from "../controllers/eventos.controller";

const router = Router();

router.get("/", authenticate, getEventos);

router.post("/", authenticate, postEvento);

export default router;

