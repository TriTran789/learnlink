import { RequestHandler } from "express";
import { validate } from "../middlewares/validate";
import { check } from "express-validator";

export const createTeacherValidator: RequestHandler[] = [
  check("email", "Email is required").isEmail(),
  check("fullName", "Full name is required").notEmpty(),
  check("phone", "Phone is required").notEmpty(),
  check("level", "Level is invalid").isIn(["master", "doctor", "professor"]),
  validate,
];
