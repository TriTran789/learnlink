import { Router } from "express";
import authorize from "../middlewares/authorize";
import { createTeacherValidator } from "../validators/teacher.validator";
import { createTeacher, getTeachers } from "../controllers/teacher.controller";

const router = Router();

router.post(
  "/create-teacher",
  authorize("ADMIN"),
  createTeacherValidator,
  createTeacher
);

router.get(
  "/get-teachers",
  authorize("ADMIN"),
  getTeachers
)

export default router;
