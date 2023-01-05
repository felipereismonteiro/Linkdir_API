import hashtagsRepository from "../repositories/hashtagsRepository.js";

export async function hashtagExistenceValidation(req, res, next) {
  const { content } = req.body;
  console.log(req.method);
  try {
    const hashtags = hashtagsRepository.filterHashtags(content);

    res.locals.hashtags = hashtags;

    if (hashtags.length === 0) {
      return next();
    }

    const { rows } = await hashtagsRepository.getHashtagsByNames(content);

    if (rows.length !== 0) {
      res.locals.existingHashtags = rows;
    }

    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
}
