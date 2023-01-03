import { Router } from "express";
import { signUpMiddleware } from "../middlewares/authMiddlewares.js";

export const authRouter = Router();

authRouter.post("/signup", signUpMiddleware);