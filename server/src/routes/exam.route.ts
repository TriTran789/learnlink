import { Router } from "express";
import authorize from "../middlewares/authorize";
import {
  createExamValidator,
  submitExamValidator,
} from "../validators/exam.validator";
import {
  createExam,
  getExamDetail,
  getExams,
  getExamTodo,
  submitExam,
} from "../controllers/exam.controler";

const router = Router();

router.post("/exam", authorize("ADMIN"), createExamValidator, createExam);
router.get("/exam", authorize("ADMIN"), getExams);
router.get("/exam/:examId", authorize("ADMIN"), getExamDetail);
router.post(
  "/submit-exam/:examId",
  authorize("STUDENT"),
  submitExamValidator,
  submitExam
);
router.get("/exam/:examId/todo", authorize("STUDENT"), getExamTodo);

export default router;
