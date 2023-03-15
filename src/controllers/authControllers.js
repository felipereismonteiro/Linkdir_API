import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authService from "../services/authService.js";

export async function signUpController(req, res) {
  try {
    const { user_name, email, password, profile_picture } = req.user;

    await authService.signUp(user_name, email, password, profile_picture)

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.send(err).status(401);
  }
}

export async function signInController(req, res) {
  try {
    const { id, user_name, profile_picture } = req.user;
    const token = jwt.sign({ id }, process.env.SECRET_KEY);

    res.send({ token, user: { id, user_name, profile_picture } });
  } catch (err) {
    res.send(err.message);
  }
}
