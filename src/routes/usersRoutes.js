import { Router } from "express";
import { getPostsByUserId } from "../controllers/postsControllers.js";
import { getUsersByName } from "../controllers/usersControllers.js";
import { tokenValidation } from "../middlewares/authMiddlewares.js";

export const usersRouter = Router();

usersRouter.get("/users", tokenValidation, getUsersByName);
usersRouter.get("/user/:id", tokenValidation, getPostsByUserId);
