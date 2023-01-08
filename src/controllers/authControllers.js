import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { insertUser } from "../repositories/authRepository.js";

export async function signUpController(req, res) {
  try {
    const { user_name, email, password, profile_picture } = req.user;

    const newPassword = bcrypt.hashSync(password, 10);

    insertUser(user_name, email, newPassword, profile_picture);

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.send(err).status(401);
  }
}

export async function signInController(req, res) {
  try {
    const { id, user_name, profile_picture } = req.user;
    const token = jwt.sign({ id }, process.env.SECRET_KEY, {
      expiresIn: 86400,
    });

    console.log(res);
    res.send({ token, user: { id, user_name, profile_picture } });
  } catch (err) {
    res.send(err.message);
  }
}
