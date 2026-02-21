import { Router } from "express";
import { body } from "express-validator";
import { handleValidationErrors } from "../middlewares/validation.middleware";
import { /*register,*/ login } from "../controllers/auth.controller";

const router = Router();


const loginValidations = [
  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .bail()
    .isEmail()
    .withMessage("El email no tiene un formato válido")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria"),
];


//router.post("/register", registerValidations, handleValidationErrors, register);
router.post("/login", loginValidations, handleValidationErrors, login);

export default router;

