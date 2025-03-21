import express from "express";
import { signInValidator } from "../validators/auth.validator";
import authController from "../controllers/auth.controller";

const router = express.Router();

router.post("/sign-in", signInValidator, authController.signIn);
router.get("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);

export default router;
