import { Router } from "express";
import { body } from "express-validator";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeAdmin } from "../middlewares/authorizeAdmin.middleware";
import { handleValidationErrors } from "../middlewares/validation.middleware";
import { createUserByAdmin } from "../controllers/users.controller";

const router = Router();

const createUserValidations = [
  body("name").notEmpty().withMessage("El nombre es obligatorio").isLength({ min: 3 }),
  body("email").notEmpty().withMessage("El email es obligatorio").isEmail().normalizeEmail(),
  body("password").notEmpty().withMessage("La contraseña es obligatoria").isLength({ min: 6 }),
  body("roleId")
    .notEmpty()
    .withMessage("roleId es obligatorio")
    .bail()
    .isInt({ min: 1 })
    ];

router.post(
  "/",
  authenticate,
  authorizeAdmin,
  createUserValidations,
  handleValidationErrors,
  createUserByAdmin
);

export default router;