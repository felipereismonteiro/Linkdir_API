import hashtagsRepository from "../repositories/hashtagsRepository.js";

export async function hashtagAlreadyRegisteredValidation(req, res, next) {
  
  const { content } = req.body;
  
  try {

    const hashtags = hashtagsRepository.filterHashtags(content);
    res.locals.hashtags = hashtags;
    
    if (hashtags.length === 0) {
      return next();
    }
    
    const { rows } = await hashtagsRepository.getHashtagsByNames(hashtags);

    if (rows.length !== 0) {
      res.locals.existingHashtags = rows;
    }
    
    next();
  } catch (err) {
    console.log(err.message)
    res.status(500).send(err.message);
  }
}

export async function hashtagExistenceValidation(req, res, next) {
  const { hashtag } = req.params;

  try {
    const { rows } = await hashtagsRepository.getOneHashTagByName(hashtag);

    if (rows.length === 0) {
      return res.status(404).send({ message: "Hashtag not found" });
    }

    res.locals.hashtagId = rows[0].id;

    return next();
  } catch (err) {
    res.status(500).send(err.message);
  }
}
