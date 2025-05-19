import { Router } from "express";
import authorize from "../middlewares/authorize";
import { createStudentValidator, updateSutdentValidator } from "../validators/student.validator";
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  updateStudent,
} from "../controllers/student.controller";

const router = Router();

router.post(
  "/create-student",
  authorize("ADMIN"),
  createStudentValidator,
  createStudent
);

router.get("/get-all-students", authorize("ADMIN"), getAllStudents);

router.delete("/delete-student/:id", authorize("ADMIN"), deleteStudent);

router.put("/update-student/:id", authorize("ADMIN"), updateSutdentValidator, updateStudent);

export default router;
