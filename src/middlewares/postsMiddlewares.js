import { postsSchemma } from "../schemas/postsSchema.js";

export function validatePostSchema(req, res, next) {

    const post = req.body
    const { error } = postsSchemma.validate(post, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(422).send({ errors });
    }

    next();
}