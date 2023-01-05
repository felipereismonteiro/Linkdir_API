import { Router } from "express";
import { getHashtags } from "../controllers/hashtagsControllers.js";
import { hashtagExistenceValidation } from "../middlewares/hashtagsMiddlewares.js";

export const hashtagsRouter = Router();

hashtagsRouter.get("/hashtags", getHashtags);
