import { body } from "express-validator";
import { validate } from "../middlewares/validate";

export const signInValidator = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .notEmpty()
    .withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

export const checkFaceValidator = [
  body("image").notEmpty().withMessage("Image is required"),
  validate,
];
