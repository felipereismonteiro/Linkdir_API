import commentsRepository from "../repositories/commentsRepository.js"

export default async function commentControllers(req, res) {
    try {
        const comment = res.comment;

        await commentsRepository.postComment(comment);

        res.sendStatus(200);
    } catch(err) {
        console.log(err);
        res.send(err.message);
    }
}