import { Router } from "express";
import { crearMascota, getMascotas } from "../controllers/mascotas.controllers";
import { authenticate } from "../middlewares/auth.middleware"; 
const router = Router();

router.post("/", authenticate, crearMascota); 
router.get("/", authenticate, getMascotas);   

export default router;