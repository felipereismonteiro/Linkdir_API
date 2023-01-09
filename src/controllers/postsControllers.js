import hashtagsRepository, {
  postHashTagsAndPostIds,
} from "../repositories/hashtagsRepository.js";
import postsRepository from "../repositories/postsRepository.js";
import urlMetadata from "url-metadata";

export async function createPost(req, res) {
  console.log("chegou no create")
  const { content, url } = req.body;
  const user_id = res.locals.userId;
  let title = "";
  let description = "";
  let image = "";
  const existingHashtags = res.locals.existingHashtags;
  const hashtags = res.locals.hashtags;

  try {
    await urlMetadata(url).then((metadata) => {
      image = metadata.image;
      title = metadata.title;
      description = metadata.description;
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
  const userId = res.locals.userId;
  try {
    const { rows } = await postsRepository.getPosts(userId);
    res.status(200).send(rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
}

export async function getPostsByHashtag(req, res) {
  const hashtagId = res.locals.hashtagId;
  const userId = res.locals.userId;

  try {
    const posts = await postsRepository.getPostsByHashtag(userId, hashtagId);

    res.send(posts.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getPostsByUserId(req, res) {
  const { id } = req.params;
  const userId = res.locals.userId;
  try {
    const posts = await postsRepository.getPostsByUserId(userId, id);

    res.status(200).send(posts.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function deletePostById(req, res) {
  try {
    const postToDelete = Number(req.params.id);
    await postsRepository.deletePost(postToDelete);
    res.status(200).send("Deleted");
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
}

export async function likePost(req, res) {
  const { postId } = req.params;
  const userId = res.locals.userId;

  try {
    await postsRepository.insertLikeToPost(userId, postId);

    res.send({ message: "Post successfully liked" });
  } catch (err) {
    res.send(err.message);
  }
}

export async function patchPostById(req, res) {
  try {
    const field = Object.keys(req.update)[1];
    const { idPost, content } = req.update;

    await postsRepository.updatePost(content, idPost);
    res.sendStatus(200);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
}

export async function unlikePost(req, res) {
  const { postId } = req.params;
  const userId = res.locals.userId; 

  try {
    await postsRepository.deleteLikeFromPost(userId, postId);

    res.send({ message: "Post successfully unliked" });
  } catch (err) {
    res.send(err.message);
  }
}
