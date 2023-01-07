import { Router } from "express";
import { getUsersByName } from "../controllers/usersControllers.js";

export const usersRouter = Router();

usersRouter.get("/users", getUsersByName);