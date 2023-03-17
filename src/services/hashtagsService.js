import hashtagsRepository from "../repositories/hashtagsRepository.js";

async function getHashtags() {
    const { rows } = await hashtagsRepository.getHashtags();

    return rows;
}

const hashtagsService = {
    getHashtags
}

export default hashtagsService;