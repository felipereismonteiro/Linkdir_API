import { Router } from "express";
import { followUser, unfollowUser } from "../controllers/followControllers.js";
import { tokenValidation } from "../middlewares/authMiddlewares.js";

export const followRoutes = Router();

followRoutes.post("/follow/:userToFollowId", tokenValidation, followUser);
followRoutes.delete("/follow/:userToFollowId", tokenValidation, unfollowUser);
