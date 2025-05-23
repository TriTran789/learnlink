import { Router } from "express";
import authorize from "../middlewares/authorize";
import { createExamValidator } from "../validators/exam.validator";
import { createExam, getExamDetail, getExams } from "../controllers/exam.controler";

const router = Router();

router.post("/exam", authorize("ADMIN"), createExamValidator, createExam);
router.get("/exam", authorize("ADMIN"), getExams);
router.get("/exam/:examId", authorize("ADMIN"), getExamDetail);

export default router;