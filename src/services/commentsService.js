import commentsRepository from "../repositories/commentsRepository.js"

async function postComment(comment) {

    await commentsRepository.postComment(comment);

}

const commentsService = {
    postComment
}

export default commentsService;