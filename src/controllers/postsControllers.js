import { connectionDB } from "../db/db.js";
import hashtagsRepository, {
  postHashTagsAndPostIds,
} from "../repositories/hashtagsRepository.js";
import postsRepository from "../repositories/postsRepository.js";
import urlMetadata from "url-metadata";

export async function createPost(req, res) {
  const { user_id, content, url } = req.body;
  let title = "";
  let description = "";
  let image = "";
  const existingHashtags = res.locals.existingHashtags;
  const hashtags = res.locals.hashtags;
  
  try {

    await urlMetadata(url).then(metadata => {

        image = metadata.image
        title = metadata.title
        description = metadata.description    
}); 

    const { rows: postRows } = await postsRepository.createPost(
      user_id,
      content,
      url,
      title,
      description,
      image
    );

    if (hashtags.length !== 0) {
      const postId = postRows[0].id;

      const { rows: hashtagsRows } = await hashtagsRepository.postHashtag(
        hashtags
      );

      let hashtagsIds = hashtagsRows;

      if (existingHashtags !== undefined) {
        hashtagsIds = [...hashtagsRows, ...existingHashtags];
      }

      await hashtagsRepository.postHashTagsAndPostIds(hashtagsIds, postId);
    }

    res.sendStatus(201); 
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getPosts(req, res) {

  try {
      const { rows } = await postsRepository.getPosts();
      res.status(200).send(rows); 
  } catch(err) {
    console.log(err.message)
      res.status(500).send(err.message) 
  }
}

export async function getPostsByHashtag(req, res) {
  const hashtagId = res.locals.hashtagId;

  try {
    const posts = await postsRepository.getPostsByHashtag(hashtagId);

    res.send(posts.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function deletePostById(req, res) {
  try {
    const id = req.id
    await postsRepository.deletePost(id);
    res.status(200).send("Deleted")
  } catch (err) {
    res.send(err.message);
  }
}