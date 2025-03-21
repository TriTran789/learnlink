import { check } from "express-validator";
import { validate } from "../middlewares/validate";

export const signInValidator = [
  check("email").isEmail().withMessage("Email is invalid"),
  check("password").isLength({ min: 1 }).withMessage("Password is required"),
  validate
];
