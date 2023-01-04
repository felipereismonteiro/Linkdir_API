import { connectionDB } from "../db/db.js";
import bcrypt from 'bcrypt';

export async function signUpController(req, res) {
  try {
    const { user_name, email, password, profile_picture } = req.user;

    const newPassword = bcrypt.hashSync(password, 10);

    console.log(newPassword);

    await connectionDB.query(
      `INSERT INTO users(user_name, email, password, profile_picture) VALUES($1, $2, $3, $4)`,
      [user_name, email, newPassword, profile_picture]
    );

    

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.send(err).status(401);
  }
}
