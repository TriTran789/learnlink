import { Router } from "express";
import {
  createLesson,
  getLessonDetail,
  getLessons,
  makeCall,
} from "../controllers/lesson.controller";
import authorize from "../middlewares/authorize";
import { createLessonValidator, makeCallValidator } from "../validators/lesson.validator";

const router = Router();

router.post(
  "/class/:classId/lesson",
  authorize("ADMIN"),
  createLessonValidator,
  createLesson
);

router.get("/class/:classId/lesson", authorize("ADMIN"), getLessons);

router.get("/lesson/:lessonId", authorize(["ADMIN", "STUDENT", "TEACHER"]), getLessonDetail);

router.post("/lesson/call", authorize(["STUDENT", "TEACHER"]), makeCallValidator, makeCall);

export default router;
