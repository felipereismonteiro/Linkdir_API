import { Router } from "express";
import {
  signInController,
  signUpController,
} from "../controllers/authControllers.js";
import {
  signInMiddleware,
  signUpMiddleware,
} from "../middlewares/authMiddlewares.js";

export const authRouter = Router();

authRouter.post("/signup", signUpMiddleware, signUpController);
authRouter.post("/signin", signInMiddleware, signInController);
