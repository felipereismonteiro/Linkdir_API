import joi from "joi";

export const signUpSchema = joi.object({
    user_name: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
    profile_picture: joi.string().required()
})