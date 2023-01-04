import { Router } from "express";
import { signUpController } from "../controllers/authControllers.js";
import { signUpMiddleware } from "../middlewares/authMiddlewares.js";

export const authRouter = Router();

authRouter.post("/signup", signUpMiddleware, signUpController);
