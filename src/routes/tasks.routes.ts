import { Router } from "express";

const router = Router();

// GET /api/tasks
router.get("/", (_req, res) => {
  res.json([{ id: 1, title: "Tarea de ejemplo", completed: false }]);
});

// POST /api/tasks
router.post("/", (req, res) => {
  const { title } = req.body;
  res.status(201).json({ id: Date.now(), title, completed: false });
});

export default router;
