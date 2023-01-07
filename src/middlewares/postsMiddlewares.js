import { postsSchemma, updatePostSchema } from "../schemas/postsSchema.js";
import dotenv from "dotenv";
import postsRepository from "../repositories/postsRepository.js";
import authRepository from "../repositories/authRepository.js";
authRepository;
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
    req.id = postToDelete;
    next();
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
}

export async function validatePatchPost(req, res, next) {
  try {
    const content = req.body;

    if (Object.keys(content).length < 1) {
      return res.status(400).send("at least one field to update");
    } else if (Object.keys(content).length === 2) {
      return res
        .status(400)
        .send(
          "please use method put insted of patch, to update the whole content"
        );
    }

    const idPost = req.params.id;
    const idUser = res.locals.userId;

    const foundedPost = await postsRepository.searchPost(idPost);
    const foundedUser = await authRepository.getUserById(idUser);

    if (foundedPost.rows.length === 0 || foundedUser.rows.length === 0) {
      return res.sendStatus(404);
    }

    if (foundedPost.rows[0].user_id !== foundedUser.rows[0].id) {
      return res.status(401).send("You`re not the owner of this post");
    }

    req.update = {
      idPost,
      content: content.content,
    };
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send(err.details.map((d) => d.message));
  }
}

export async function validatePutPost(req, res, next) {
  try {
    const content = req.body;

    if (Object.keys(content).length < 2) {
      return res.status(400).send("all fields required");
    }

    const idPost = req.params.id;
    const idUser = res.locals.userId;

    const foundedPost = await postsRepository.searchPost(idPost);
    const foundedUser = await authRepository.getUserById(idUser);

    if (foundedPost.rows.length === 0 || foundedUser.rows.length === 0) {
      return res.sendStatus(404);
    }

    if (foundedPost.rows[0].user_id !== foundedUser.rows[0].id) {
      return res.status(401).send("You`re not the owner of this post");
    }

    req.update = {
      content: content.content,
      url: content.url,
    };
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send(err.details.map((d) => d.message));
  }
}
