import { Router } from "express";
import authorize from "../middlewares/authorize";
import {
  createExamValidator,
  submitExamValidator,
} from "../validators/exam.validator";
import {
  checkExam,
  createExam,
  getExamDetail,
  getExamResult,
  getExams,
  getExamTodo,
  getResultTotal,
  submitExam,
} from "../controllers/exam.controler";

const router = Router();

router.post("/exam", authorize("ADMIN"), createExamValidator, createExam);
router.get("/exam", authorize("ADMIN"), getExams);
router.get("/exam/:examId", authorize("ADMIN"), getExamDetail);
router.post(
  "/submit-exam/:examId/:warning",
  authorize("STUDENT"),
  submitExamValidator,
  submitExam
);
router.get("/exam/:examId/todo", authorize("STUDENT"), getExamTodo);
router.get("/exam/:examId/check", authorize("STUDENT"), checkExam);
router.get("/exam/:examId/result", authorize("STUDENT"), getExamResult);
router.get("/exam/:examId/result-total", authorize(["ADMIN", "TEACHER"]), getResultTotal);

export default router;
