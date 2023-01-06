import joi from "joi";

export const postsSchemma = joi.object({
  content: joi.string().max(280),
  url: joi.string().uri().required(),
});

export const updatePostSchema = joi.object({
  content: joi.string().max(280).required(),
  url: joi.string().uri().required(),
})