import { postsSchemma } from "../schemas/postsSchema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import postsRepository from "../repositories/postsRepository.js";
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

export function validateDeletePost(req, res, next) {
 try {
  const postToDelete = Number(req.params.id);
  const { authorization } = req.headers;
  

  if (!authorization || authorization.split(" ").length !== 2 || authorization.split(" ")[0] !== "Bearer") {
    return res.sendStatus(401);
  } 

  const [ Bearer, token ] = authorization.split(" ")

  jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
    if(error) {
      return res.status(401).send("Invalid token");
    }

    const postToBeDeleted = await postsRepository.searchPost(postToDelete)
    .catch(err => console.log(err));

    if (postToBeDeleted.rows.length === 0) {
      return res.sendStatus(404);
    }

    if (postToBeDeleted.rows[0].user_id !== decoded.id) {
      return res.status(401).send("You`re not the owner of this post")
    }

    

    req.id = postToDelete
    next()
  });
  
  
 } catch(err) {
  console.log(err.message)
  res.send(err.message);
 }
}