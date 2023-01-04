import hashtagsRepository from "../repositories/hashtagsRepository.js";
import postsRepository from "../repositories/postsRepository.js";

export async function createPost(req, res) {

    const {user_id, content, url} = req.body;
   
    try {
        const {rows:postRows} = await postsRepository.createUser(user_id, content, url);
        const post_id =postRows[0].id;

        const {rows: hashtagsRows} = await hashtagsRepository.postHashtag(content);
        
        
        console.log(hashtagsRows) 
        console.log(post_id, "teste");
        res.sendStatus(201);
    } catch(err) {
        res.status(500).send(err.message)
    }
    
}
