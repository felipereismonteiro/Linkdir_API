import hashtagsService from "../services/hashtagsService.js";

export async function getHashtags(req, res) {
  try {
    const rows = await hashtagsService.getHashtags();
    res.send(rows);
  } catch (err) {
    res.status(500).send(err.message); 
  }
}
