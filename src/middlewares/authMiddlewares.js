import { connectionDB } from "../db/db.js"

export async function signUpMiddleware(req, res, next) {
    try {
        const user = await connectionDB.query(`SELECT * FROM users`);

        console.log(user);
    } catch(err) {
        console.log(err);
        res.send(err.message);
    }
}