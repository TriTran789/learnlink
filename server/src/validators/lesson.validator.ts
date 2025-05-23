import { body } from "express-validator";
import { validate } from "../middlewares/validate";

export const createLessonValidator = [
  body("name").isString().withMessage("Name is required"),
  body("start_time")
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

  // Kiểm tra trường end_time
  body("end_time")
    .notEmpty()
    .withMessage("End time is required")
    .isISO8601()
    .withMessage("End time must be a valid ISO 8601 date")
    .custom((value, { req }) => {
      const startTime = new Date(req.body.start_time);
      const endTime = new Date(value);
      if (endTime <= startTime) {
        throw new Error("End time must be after start time");
      }
      return true;
    }),
  validate,
];

export const makeCallValidator = [
  body("userId").isString().withMessage("User ID is required"),
  body("lessonId").isString().withMessage("Lesson ID is required"),
  validate,
];
