import { Router } from "express";
import authorize from "../middlewares/authorize";
import { createQuestionValidator } from "../validators/question.validator";
import { createQuestion, deleteQuestion } from "../controllers/question.controller";

const router = Router();

router.post(
  "/question",
  authorize("ADMIN"),
  createQuestionValidator,
  createQuestion
);
router.delete("/question/:questionId", authorize("ADMIN"), deleteQuestion);

export default router;
