import { body } from "express-validator";
import { validate } from "../middlewares/validate";

export const createSubjectValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  validate,
];
