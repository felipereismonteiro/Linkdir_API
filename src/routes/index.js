import { Router } from "express";
import { authRouter } from "./authRoutes.js";

export const router = Router();
router.use(authRouter);