import { Router } from "express";
import { createPost } from "../controllers/postsControllers.js";
import { validatePostSchema } from "../middlewares/postsMiddlewares.js";

export const postsRouter = Router();

postsRouter.post("/posts", validatePostSchema, createPost);