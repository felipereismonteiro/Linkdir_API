import hashtagsRepository, {
  postHashTagsAndPostIds,
} from "../repositories/hashtagsRepository.js";
import postsRepository from "../repositories/postsRepository.js";

export async function createPost(req, res) {
  const { user_id, content, url } = req.body;
  const existingHashtags = res.locals.existingHashtags;

  try {
    const { rows: postRows } = await postsRepository.createPost(
      user_id,
      content,
      url
    );
    const postId = postRows[0].id;

    const { rows: hashtagsRows } = await hashtagsRepository.postHashtag(
        content
      );
      let hashtagsIds = hashtagsRows;
  
      if (existingHashtags !== undefined) {
        hashtagsIds = [...hashtagsRows, ...existingHashtags];
      }
  
      await hashtagsRepository.postHashTagsAndPostIds(hashtagsIds, postId);
  
      res.sendStatus(201);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }


export async function getPosts(req, res) {

    try {
        const posts = await postsRepository.getPosts();
        res.status(200).send(posts.rows);
    } catch(err) {
        res.status(500).send(err.message)
    }
}

