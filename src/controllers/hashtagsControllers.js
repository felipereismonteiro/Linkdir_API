import hashtagsRepository from "../repositories/hashtagsRepository.js";

export async function getHashtags(req, res) {
  try {
    const { rows } = await hashtagsRepository.getHashtags();
    res.send(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
