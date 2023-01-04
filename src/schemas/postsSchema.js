import joi from 'joi';

export const postsSchemma = joi.object({
    user_id: joi.required(),
    content: joi.string().max(280),
    url: joi.string().uri().required()
  });