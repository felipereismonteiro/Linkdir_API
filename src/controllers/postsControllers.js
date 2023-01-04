import hashtagsRepository, {
  postHashTagsAndPostIds,
} from "../repositories/hashtagsRepository.js";
import postsRepository from "../repositories/postsRepository.js";

export async function createPost(req, res) {
  const { user_id, content, url } = req.body;

  try {
    const { rows: postRows } = await postsRepository.createUser(
      user_id,
      content,
      url
    );
    const postId = postRows[0].id;

    const { rows: hashtagsRows } = await hashtagsRepository.postHashtag(
      content
    );

    await hashtagsRepository.postHashTagsAndPostIds(hashtagsRows, postId);
    
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
