import { Router } from "express";
import { getHashtags } from "../controllers/hashtagsControllers.js";

export const hashtagsRouter = Router();

hashtagsRouter.get("/hashtags", getHashtags);
hashtagsRouter.get("/hashtags/:hashtag");
