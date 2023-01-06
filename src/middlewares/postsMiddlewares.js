import { postsSchemma } from "../schemas/postsSchema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import postsRepository from "../repositories/postsRepository.js";
import { tokenValidation } from "./authMiddlewares.js";
dotenv.config();

export function validatePostSchema(req, res, next) {

    const post = req.body
    const { error } = postsSchemma.validate(post, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(422).send({ errors });
    }

    next();
}