import { connectionDB } from "../db/db.js";
import postsRepository from "../repositories/postsRepository.js";

export async function createPost(req, res) {

    const {user_id, content, url} = req.body;

    try {
        await postsRepository.createUser(user_id, content, url);
        res.sendStatus(201);
    } catch(err) {
        res.status(500).send(err.message)
    }
    
}