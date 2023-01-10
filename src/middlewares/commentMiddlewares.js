import postsRepository from "../repositories/postsRepository.js";

export default async function commentMiddleware(req, res, next) {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        const { userId } = res.locals;

        const postFounded = await postsRepository.searchPost(id);

        if (postFounded.rows.length === 0) {
            return res.status(404).send("post not found");
        }

        const commentBody = {
            user_id: userId,
            post_id: Number(id),
            comment
        }
        
        res.comment = commentBody;
        next()
    } catch(err) {
        console.log(err);
        res.send(err.message);
    }
}