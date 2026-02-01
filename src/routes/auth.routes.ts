import { Router } from "express";

const router = Router();

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  res.status(201).json({
    message: "Register placeholder",
    received: { name, email, password },
  });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  res.json({
    message: "Login placeholder",
    received: { email, password },
  });
});

export default router;
