import { connectionDB } from "../db/db.js";
import bcrypt from "bcrypt";
import { signInSchema, signUpSchema } from "../schemas/authSchema.js";
import jwt from "jsonwebtoken";
import authRepository from "../repositories/authRepository.js";

export async function signUpMiddleware(req, res, next) {
  try {
    const body = req.body;

    const validate = await signUpSchema.validateAsync(body, {
      abortEarly: false,
    });

    const user_fouded = await connectionDB.query(
      `SELECT * FROM users WHERE email=$1`,
      [validate.email]
    );

    if (user_fouded.rows.length !== 0) {
      return res.send("email already in use!").status(401);
    }

    req.user = validate;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send(err.message);
  }
}

export async function signInMiddleware(req, res, next) {
  try {
    const body = req.body;

    await signInSchema.validateAsync(body, { abortEarly: false });

    const founded = await connectionDB.query(
      `SELECT * FROM users WHERE email=$1`,
      [body.email]
    );

    const { password } = founded.rows[0];

    if (!bcrypt.compareSync(body.password, password)) {
      return res.sendStatus(401);
    }

    req.user = founded.rows[0];
    next();
  } catch (err) {
    res.status(401).send(err.message);
  }
}

export function tokenValidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send({ message: "Invalid token" });
  }

  jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {

    if (error) {
      return res.status(401).send({ message: "Invalid token" });
    }

    try {
        
      const { rowCount } = await authRepository.getUserById(decoded.id);

      if (rowCount === 0) {
        return res.status(404).send({ message: "User not found" });
      }

      res.locals.userId = decoded.id;

      return next();
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });
}
