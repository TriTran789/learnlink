import { RequestHandler } from "express";
import { check } from "express-validator";
import { validate } from "../middlewares/validate";

export const createUserValidator: RequestHandler[] = [
  check("email", "Email is required").isEmail(),
  check("password", "Password is required").isLength({ min: 6 }),
  check("role", "Invalid Role").isIn(["root", "teacher", "student"]),
  validate,
];
