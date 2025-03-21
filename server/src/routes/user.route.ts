import express, { Request, Response } from "express";
import userController from "../controllers/user.controller";
import { createUserValidator } from "../validators/user.validator";

const router = express.Router();

router.post("/create", createUserValidator, userController.createUser);

export default router;
