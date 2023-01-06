import { Router } from "express";
import { createPost, getPosts, getPostsByHashtag } from "../controllers/postsControllers.js";
import { hashtagAlreadyRegisteredValidation, hashtagExistenceValidation } from "../middlewares/hashtagsMiddlewares.js";
import { validatePostSchema } from "../middlewares/postsMiddlewares.js";

export const postsRouter = Router();

postsRouter.post(
  "/posts",
  validatePostSchema,
  hashtagAlreadyRegisteredValidation,
  createPost
);

postsRouter.get("/posts", getPosts);
postsRouter.get("/posts/:hashtag", hashtagExistenceValidation, getPostsByHashtag)