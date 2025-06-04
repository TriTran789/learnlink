import { Router } from "express";
import {
  checkFace,
  refreshToken,
  signIn,
  signOut,
} from "../controllers/auth.controller";
import {
  checkFaceValidator,
  signInValidator,
} from "../validators/auth.validator";
import authorize from "../middlewares/authorize";

const router = Router();

router.post("/sign-in", signInValidator, signIn);
router.post("/refresh-token", refreshToken);
router.post("/sign-out", signOut);
router.post("/check-face", authorize("STUDENT"), checkFaceValidator, checkFace);

export default router;
