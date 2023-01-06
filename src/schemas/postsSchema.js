import joi from "joi";

export const postsSchemma = joi.object({
  content: joi.string().max(280),
  url: joi.string().uri().required(),
});
