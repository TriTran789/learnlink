import { Router } from "express";
import authorize from "../middlewares/authorize";
import { createSubjectValidator } from "../validators/subject.validator";
import {
  createSubject,
  deleteSubject,
  getAllSubjects,
  updateSubject,
} from "../controllers/subject.controller";

const router = Router();

router.post(
  "/create-subject",
  authorize("ADMIN"),
  createSubjectValidator,
  createSubject
);
router.get("/get-subjects", authorize("ADMIN"), getAllSubjects);
router.delete("/delete-subject/:id", authorize("ADMIN"), deleteSubject);
router.put(
  "/update-subject/:id",
  authorize("ADMIN"),
  createSubjectValidator,
  updateSubject
);

export default router;
