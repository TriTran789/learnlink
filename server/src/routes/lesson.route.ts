import { Router } from "express"
import { createLesson } from "../controllers/lesson.controller";

const router = Router();

router.post("/lesson", createLesson);

export default router;