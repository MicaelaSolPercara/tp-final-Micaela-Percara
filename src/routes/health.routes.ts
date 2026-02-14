import { Router } from "express";
import pool from "../database/mysql";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json({ ok: true, db: rows });
  } catch (error) {
    next(error);
  }
});

export default router;
