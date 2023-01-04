import { connectionDB } from "../db/db.js"
import bcrypt from "bcrypt";
import { signInSchema, signUpSchema } from "../schemas/authSchema.js";

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
        res.status(401).send(err.details.map(e => e.message));
    }
}

export async function signInMiddleware(req, res, next) {
    try {
        const body = req.body;
        await signInSchema.validateAsync(body, {abortEarly: false})
    
        const founded = await connectionDB.query(`SELECT * FROM users WHERE email=$1`, [body.email]);
        const { password } = founded.rows[0];

        if(!bcrypt.compareSync(body.password, password)) {
            return res.sendStatus(401);
        }
        
        req.email = body.email
        next();
    } catch (err) {
        res.send(err.details.map(d => d.message)).status(400);
    }
}