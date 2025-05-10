import { Router } from "express";
import authorize from "../middlewares/authorize";
import {
  createTeacherValidator,
  updateTeacherValidator,
} from "../validators/teacher.validator";
import {
  createTeacher,
  deleteTeacher,
  getTeachers,
  updateTeacher,
} from "../controllers/teacher.controller";

const router = Router();

router.post(
  "/create-teacher",
  authorize("ADMIN"),
  createTeacherValidator,
  createTeacher
);

router.get("/get-teachers", authorize("ADMIN"), getTeachers);

router.delete("/delete-teacher/:id", authorize("ADMIN"), deleteTeacher);

router.put(
  "/update-teacher/:id",
  authorize("ADMIN"),
  updateTeacherValidator,
  updateTeacher
);

export default router;
