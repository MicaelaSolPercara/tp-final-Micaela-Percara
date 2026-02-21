import { Router } from "express";
import { body, param } from "express-validator";
import { handleValidationErrors } from "../middlewares/validation.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { getEventos, postEvento, patchEvento, deleteEvento } from "../controllers/eventos.controller";

const router = Router();

const createEventoValidations = [
  body("fecha")
    .notEmpty()
    .withMessage("La fecha es obligatoria")
    .bail()
    .isISO8601()
    .withMessage("La fecha debe tener formato ISO (YYYY-MM-DD)"),

  body("hora")
    .notEmpty()
    .withMessage("La hora es obligatoria")
    .bail()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("La hora debe tener formato HH:mm (ej: 09:30)"),

  body("descripcion")
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .bail()
    .isLength({ min: 5 })
    .withMessage("La descripción debe tener al menos 5 caracteres"),

  body("mascotaId")
    .notEmpty()
    .withMessage("La mascota es obligatoria")
    .bail()
    .isInt({ min: 1 })
    .withMessage("MascotaId debe ser un numero entero valido"),

    body("veterinarioId")
    .notEmpty()
    .withMessage("El veterinario es obligatorio")
    .bail()
    .isInt({min: 1})
    .withMessage("VeterinarioId debe ser un numero entero")
];

const updateEventoValidations = [
  body("fecha")
    .optional()
    .isISO8601()
    .withMessage("La fecha debe tener formato ISO (YYYY-MM-DD)"),

  body("hora")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("La hora debe tener formato HH:mm (ej: 09:30)"),

  body("descripcion")
    .optional()
    .isLength({ min: 5 })
    .withMessage("La descripción debe tener al menos 5 caracteres"),

  body("mascotaId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("MascotaId debe ser un numero entero valido"),

    body("veterinarioId")
    .optional()
    .isInt({min: 1})
    .withMessage("VeterinarioId debe ser un numero entero")
];

const idParamValidation = [
  param("id")
    .custom((value) => {
      if (!/^\d+$/.test(value)) {
        throw new Error("El id debe ser un número entero válido");
      }
      return true;
    }),
];



router.get("/", authenticate, getEventos);

router.post("/", authenticate, createEventoValidations, handleValidationErrors, postEvento);

router.patch("/:id", authenticate, idParamValidation, updateEventoValidations, handleValidationErrors, patchEvento);
router.delete("/:id", authenticate, idParamValidation, handleValidationErrors, deleteEvento);

export default router;

