import hashtagsRepository, {
  postHashTagsAndPostIds,
} from "../repositories/hashtagsRepository.js";
import postsRepository from "../repositories/postsRepository.js";
import urlMetadata from "url-metadata";
import followRepository from "../repositories/followRepository.js";
import usersRepository from "../repositories/usersRepository.js";

export async function createPost(req, res) {
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
    const { rows: posts } = await postsRepository.getPosts(userId);

    const { rows: accounts_you_follow } =
      await followRepository.getAccountsFollowedByUser(userId);

    res.status(200).send({ accounts_you_follow, posts });
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
    const followStatus = await followRepository.getFollowStatus(userId, id);
    const userInfo = await usersRepository.getUserInfos(id);

    res.status(200).send({
      userInfo: userInfo.rows[0],
      is_followed: followStatus.rows[0].is_followed,
      posts: posts.rows,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function deletePostById(req, res) {
  try {
    const postToDelete = Number(req.params.id);

    await postsRepository.deletePostLikeRelation(postToDelete);
    await postsRepository.deletePostHashTagRelation(postToDelete);
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
    const { idPost, content } = req.update;
    const existingHashtags = res.locals.existingHashtags;
    const hashtags = res.locals.hashtags;

    await postsRepository.updatePost(content, idPost);
    await postsRepository.deletePostHashTagRelation(idPost);

    if (hashtags.length !== 0) {
      const { rows: hashtagsRows } = await hashtagsRepository.postHashtag(
        hashtags
      );

      let hashtagsIds = hashtagsRows;

      if (existingHashtags !== undefined) {
        hashtagsIds = [...hashtagsRows, ...existingHashtags];
      }

      await hashtagsRepository.postHashTagsAndPostIds(hashtagsIds, idPost);
    }

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

export async function sharePost(req, res) {
  const { postId } = req.params;
  const userId = res.locals.userId;

  try {
    await postsRepository.sharePost(postId, userId);

    res.sendStatus(201);
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
}

export async function countNewPosts(req, res) {
  const { timestamp } = req.params;
  // const userId = res.locals.userId;

  try {
    const { rows } = await postsRepository.countNewPosts(timestamp)

    res.status(200).send(rows[0]);
  } catch(err) { 
    res.status(500).send(err.message)
  }
}
