import { postsSchemma } from "../schemas/postsSchema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import postsRepository from "../repositories/postsRepository.js";
import { tokenValidation } from "./authMiddlewares.js";
dotenv.config();

export function validatePostSchema(req, res, next) {
  const post = req.body;
  const { error } = postsSchemma.validate(post, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send({ errors });
  }

  next();
}

export async function validateDeletePost(req, res, next) {
  try {
    const postToDelete = Number(req.params.id);
    const decodedId = res.locals.userId;

    const postToBeDeleted = await postsRepository
      .searchPost(postToDelete)
      .catch((err) => console.log(err));

    if (postToBeDeleted.rows.length === 0) {
      return res.sendStatus(404);
    }

    if (postToBeDeleted.rows[0].user_id !== decodedId) {
      return res.status(401).send("You`re not the owner of this post");
    }

    req.id = postToDelete;
    next();
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
}

export async function postExistenceValidation(req, res, next) {
  const { postId } = req.params;

  try {
    const { rowCount } = await postsRepository.searchPost(postId);

    if (rowCount === 0) {
      return res.status(404).send({ message: "Post not found" });
    }

    return next();
  } catch (err) {
    res.send(err.message);
  }
}
