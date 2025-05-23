import { body } from "express-validator";
import { validate } from "../middlewares/validate";

export const createQuestionValidator = [
  body("examId").isString().notEmpty().withMessage("examId is required"),
  body("content")
    .isString()
    .notEmpty()
    .withMessage("Question content is required"),
  body("a").isString().notEmpty().withMessage("Option A is required"),
  body("b").isString().notEmpty().withMessage("Option B is required"),
  body("c").isString().notEmpty().withMessage("Option C is required"),
  body("d").isString().notEmpty().withMessage("Option D is required"),
  body("answer")
    .isString()
    .notEmpty()
    .withMessage("Answer is required")
    .isIn(["a", "b", "c", "d"])
    .withMessage("Answer must be one of a, b, c, or d"),
  validate,
];
