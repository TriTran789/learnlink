import { body } from "express-validator";
import { validate } from "../middlewares/validate";

export const createTeacherValidator = [
  body("fullName").isString().withMessage("Full name is required"),
  body("level")
    .isIn(["MASTER", "PHD", "PROFESSOR"])
    .withMessage("Invalid level"),
  body("phone").isString().withMessage("Phone is required"),
  body("email").isEmail().withMessage("Invalid email"),
  validate,
];
