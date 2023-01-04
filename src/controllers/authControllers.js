import bcrypt from 'bcrypt';
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
    const email = req.email;
    const token = jwt.sign({email}, process.env.SECRET_KEY, {expiresIn: 86400})

    res.send({token})
  } catch (err) {
    res.send(err.message);
  }
}
