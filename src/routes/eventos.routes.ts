import { Router } from "express";
import { list, create } from "../controllers/eventos.controller";

const router = Router();

router.get("/", list);
router.post("/", create);

export default router;
