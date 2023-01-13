import commentsRepository, { getComment } from "../repositories/commentsRepository.js"

export async function commentControllers(req, res) {
    try {
        const comment = res.comment;

        await commentsRepository.postComment(comment);

        res.sendStatus(200);
    } catch(err) {
        console.log(err);
        res.send(err.message);
    }
}

export async function commentGetControllers(req, res) {
    try {
        const { userId } = res.locals;
        const id = req.params;
        const promisse = await getComment(id, userId);
        res.send(promisse.rows);
    } catch (err) {
        res.send(err.message);
    }
}