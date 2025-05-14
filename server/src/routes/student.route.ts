import { Router } from "express";
import authorize from "../middlewares/authorize";
import { createStudentValidator } from "../validators/student.validator";
import { createStudent } from "../controllers/student.controller";

const router = Router();

router.post(
  "/create-student",
  authorize("ADMIN"),
  createStudentValidator,
  createStudent
);

export default router;
