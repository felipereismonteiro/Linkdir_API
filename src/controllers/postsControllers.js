import postsRepository from "../repositories/postsRepository.js";

export async function createPost(req, res) {

    const {user_id, content, url} = req.body;

    try {
        await postsRepository.createPost(user_id, content, url);
        res.sendStatus(201);
    } catch(err) {
        res.status(500).send(err.message)
    }
    
}

export async function getPosts(req, res) {

    try {
        const posts = await postsRepository.getPosts();
        res.status(200).send(posts.rows);
    } catch(err) {
        res.status(500).send(err.message)
    }
    
}