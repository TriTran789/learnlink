import { body } from "express-validator";
import { validate } from "../middlewares/validate";

export const createClassValidator = [
  body("teacher_id").notEmpty().withMessage("Teacher required"),
  body("subject_id").notEmpty().withMessage("Subjet is required"),
  body("name").notEmpty().withMessage("Class name is required"),
  validate,
];

export const addStudentToClassValidator = [
  body("students").isArray().withMessage("Student is required"),
  validate,
];
