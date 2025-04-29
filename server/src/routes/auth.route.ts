import { Router } from "express";
import { refreshToken, signIn, signOut } from "../controllers/auth.controller";
import { signInValidator } from "../validators/auth.validator";

const router = Router();

router.post("/sign-in", signInValidator, signIn);
router.post("/refresh-token", refreshToken);
router.post("/sign-out", signOut);

export default router;
