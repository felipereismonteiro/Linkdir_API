import { connectionDB } from "../db/db.js"
import { signUpSchema } from "../schemas/authSchema.js";

export async function signUpMiddleware(req, res, next) {
    try {
        const body = req.body;

        const validate = await signUpSchema.validateAsync(body, {abortEarly: false})

        const user_fouded = await connectionDB.query(`SELECT * FROM users WHERE email=$1`, [validate.email]);

        if (user_fouded.rows.length !== 0) {
            return res.send("email already in use!").status(401);
        }

        req.user = validate;
        next();
    } catch(err) {
        console.log(err);
        res.send(err.details.map(e => e.message));
    }
}