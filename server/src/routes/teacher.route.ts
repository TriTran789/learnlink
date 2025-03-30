import express from "express";
import teacherController from "../controllers/teacher.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { createTeacherValidator } from "../validators/teacher.validator";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  createTeacherValidator,
  teacherController.createTeacher
);

export default router;
