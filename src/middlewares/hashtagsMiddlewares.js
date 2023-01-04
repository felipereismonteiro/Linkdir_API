import hashtagsRepository from "../repositories/hashtagsRepository.js";

export async function hashtagExistenceValidation(req, res, next) {
  const { content } = req.body;

  try {
    const { rows } = await hashtagsRepository.getHashtagByName(content);

    if (rows.length !== 0) {
      res.locals.existingHashtags = rows;
    }

    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
}
