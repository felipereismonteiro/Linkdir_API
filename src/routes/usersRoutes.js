import { Router } from "express";
import { getPostsByUserId } from "../controllers/postsControllers.js";
import { getUsersByName } from "../controllers/usersControllers.js";

export const usersRouter = Router();

usersRouter.get("/users", getUsersByName);
usersRouter.get("/user/:id", getPostsByUserId);
