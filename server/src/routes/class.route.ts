import { Router } from "express";
import authorize from "../middlewares/authorize";
import {
  addStudentToClassValidator,
  createClassValidator,
} from "../validators/class.validator";
import {
  addStudentToClass,
  createClass,
  deleteSudentFromClass,
  getAllClasses,
  getClassDetail,
  getStudentForClass,
} from "../controllers/class.controller";

const router = Router();

router.post("/class", authorize("ADMIN"), createClassValidator, createClass);
router.get("/class", authorize("ADMIN"), getAllClasses);
router.get("/class/:classId", authorize("ADMIN"), getClassDetail);
router.get("/class/:classId/students", authorize("ADMIN"), getStudentForClass);
router.post(
  "/class/:classId/add-students",
  authorize("ADMIN"),
  addStudentToClassValidator,
  addStudentToClass
);
router.delete(
  "/class/:classId/student/:studentId",
  authorize("ADMIN"),
  deleteSudentFromClass
);

export default router;
