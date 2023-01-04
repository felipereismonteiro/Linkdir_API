import { Router } from "express";
import { authRouter } from "./authRoutes.js";
import {hashtagsRouter} from "./hashtagsRoutes.js";
import { postsRouter } from "./postsRoutes.js";

export const router = Router();
router.use(authRouter);
router.use(postsRouter);
router.use(hashtagsRouter);
