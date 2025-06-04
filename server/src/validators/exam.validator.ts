import { body } from "express-validator";
import { validate } from "../middlewares/validate";

export const createExamValidator = [
  body("classId").isString().notEmpty().withMessage("Class ID is required"),
  body("name").isString().notEmpty().withMessage("Exam name is required"),
  body("duration")
    .isInt({ min: 1 })
    .withMessage("Duration must be greater than 0"),
  body("startAt")
    .notEmpty()
    .withMessage("Start time is required")
    .isISO8601()
    .withMessage("Start time must be a valid ISO 8601 date")
    .custom((value, { req }) => {
      const startTime = new Date(value);
      const now = new Date();
      if (startTime < now) {
        throw new Error("Start time must be in the future");
      }
      return true;
    }),

  // Kiểm tra trường endAt
  body("endAt")
    .notEmpty()
    .withMessage("End time is required")
    .isISO8601()
    .withMessage("End time must be a valid ISO 8601 date")
    .custom((value, { req }) => {
      const startTime = new Date(req.body.startAt);
      const endTime = new Date(value);
      if (endTime <= startTime) {
        throw new Error("End time must be after start time");
      }
      return true;
    }),
  validate,
];

export const submitExamValidator = [
  body().isArray().withMessage("Request body must be an array"),
  body().notEmpty().withMessage("Request body array cannot be empty"),

  body("*").custom((value) => {
    if (Object.keys(value).length === 0) {
      return true; // Allow empty objects
    }
    if (Object.keys(value).length === 1 && "answer" in value) {
      return true; // Allow objects with only 'answer' property
    }
    throw new Error('Object can only contain an "answer" property or be empty');
  }),

  validate,
];
