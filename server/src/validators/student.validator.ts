import { body } from "express-validator";
import { validate } from "../middlewares/validate";

export const createStudentValidator = [
  body("fullName").isString().withMessage("Full name is required"),
  body("phone").isString().withMessage("Phone is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("image").isString().withMessage("Image is required"),
  validate,
];

export const updateSutdentValidator = [
  body("fullName").isString().withMessage("Full name is required"),
  body("phone").isString().withMessage("Phone is required"),
  body("newImage").optional().isString(),
  validate,
];
