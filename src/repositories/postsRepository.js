import { connectionDB } from "../db/db.js";

async function createPost(user_id, content, url, title, description, image) {
  return connectionDB.query(
    "INSERT INTO posts (user_id, content, url, url_title, url_description, url_image) VALUES($1, $2, $3, $4, $5, $6) RETURNING id;",
    [user_id, content, url, title, description, image]
  );
}

async function getPosts(userId) {
  return connectionDB.query(
    `SELECT posts.id, posts.user_id, posts.content, posts.url, shares.created_at, posts.url_title, posts.url_description,
      posts.url_image, u1.user_name AS user_name, u1.profile_picture, u2.user_name AS shared_by, u2.id AS post_share_user,
    'share' AS type,COUNT (shares.post_id) AS shares, COUNT (likes.post_id) AS likes, COUNT (comments.post_id) AS comments_amount,
    array_agg(jsonb_build_object('id',u3.id, 'user_name', u3.user_name)) AS liked_by,
    array_agg(jsonb_build_object('user_id', u4.id, 'user_name', u4.user_name, 'user_picture', u4.profile_picture , 'comment', comments.comment)) AS comments,
    CASE 
      WHEN $1 = ANY (array_agg(u3.id)) THEN true
      ELSE false 
      END AS is_liked
    FROM 
      shares 
    JOIN 
      posts 
    ON 
      shares.post_id = posts.id 
    JOIN 
      users u1 
    ON 
      posts.user_id = u1.id 
    JOIN 
      users u2 
    ON 
      shares.user_id = u2.id
    LEFT JOIN 
      likes 
    ON 
      likes.post_id = posts.id
    LEFT JOIN 
      users u3 
    ON 
      u3.id = likes.user_id
    LEFT JOIN
      comments
    ON
      comments.post_id = posts.id
    LEFT JOIN 
      users u4
    ON
      comments.user_id = u4.id
    GROUP BY 
      posts.id, shares.created_at, u1.user_name, u1.profile_picture, u2.user_name, u2.id
    UNION ALL 
    SELECT 
      posts.*, u1.user_name, u1.profile_picture, NULL AS shared_by, u1.id AS post_share_user,
      'post' AS type, COUNT (shares.post_id) AS shares, COUNT (likes.post_id) AS likes, COUNT (comments.post_id) AS comments_amount,
      array_agg(jsonb_build_object('id',u2.id, 'user_name', u2.user_name)) AS liked_by,
      array_agg(jsonb_build_object('user_id', u3.id, 'user_name', u3.user_name, 'user_picture', u3.profile_picture , 'comment', comments.comment)) AS comments,
      CASE 
      WHEN $1 = ANY (array_agg(u2.id)) THEN true
      ELSE false 
      END AS is_liked
    FROM 
      posts 
    JOIN 
      users u1 
    ON 
      posts.user_id = u1.id
    LEFT JOIN 
      shares 
    ON 
      shares.post_id = posts.id 
    LEFT JOIN 
      likes 
    ON 
      likes.post_id = posts.id
    LEFT JOIN
      comments
    ON
      comments.post_id = posts.id
    LEFT JOIN 
      users AS u2
    ON
      u2.id = likes.user_id    
    LEFT JOIN 
      users u2 
    ON 
      u2.id = likes.user_id
    LEFT JOIN
      comments
    ON
      comments.post_id = posts.id
    LEFT JOIN 
      users u3
    ON
      comments.user_id = u3.id
    GROUP BY 
      posts.id, u1.id, u1.user_name, u1.profile_picture 
    ORDER BY created_at DESC 
    LIMIT 
      20;`,
    [userId] 
  );
}

function getPostsByHashtag(userId, id) {
  return connectionDB.query(
    ` SELECT 
    posts.*, users.user_name, users.profile_picture, COUNT (likes.post_id) AS likes, 
    array_agg(jsonb_build_object('id',u.id, 'user_name', u.user_name)) AS liked_by,
    array_agg(jsonb_build_object('comment', comments.comment)) AS comments,
  CASE 
    WHEN $1 = ANY (array_agg(u.id)) THEN true
    ELSE false 
    END AS is_liked
  FROM 
    posts
  JOIN 
    users 
  ON 
    posts.user_id = users.id
  LEFT JOIN
    likes
  ON 
    likes.post_id = posts.id
  LEFT JOIN 
    users AS u
  ON
    u.id = likes.user_id
  LEFT JOIN
    comments
  ON
    comments.post_id = posts.id
  JOIN 
    posts_hashtags
  ON 
    posts.id = posts_hashtags.post_id
  WHERE
    posts_hashtags.hashtag_id = $2
  GROUP BY
    posts.id, users.user_name, users.profile_picture
  ORDER BY 
    posts.id DESC 
  ;`,
    [userId, id]
  );
}

function getPostsByUserId(userId, id) {
  return connectionDB.query(
    `SELECT 
      posts.*,users.user_name, users.profile_picture, COUNT (likes.post_id) AS likes, array_agg(
        jsonb_build_object('id',u.id, 'user_name', u.user_name)) AS liked_by,
    CASE 
      WHEN $1 = ANY (array_agg(u.id)) THEN true
      ELSE false 
      END AS is_liked
    FROM 
      posts
    JOIN 
      users 
    ON 
      posts.user_id = users.id
    LEFT JOIN
      likes
    ON 
      likes.post_id = posts.id
    LEFT JOIN 
      users AS u
    ON
      u.id = likes.user_id
    WHERE
        users.id = $2
    GROUP BY
      posts.id, users.user_name, users.profile_picture 
    ORDER BY 
      posts.id DESC 
    ;`,
    [userId, id]
  );
}

function searchPost(id) {
  return connectionDB.query(`SELECT * FROM posts WHERE id=$1`, [id]);
}

function deletePost(id) {
  const promisse2 = connectionDB.query(`DELETE FROM posts WHERE id=$1`, [id]);
  return promisse2;
}

function insertLikeToPost(userId, postId) {
  return connectionDB.query(
    `INSERT INTO likes (user_id, post_id) VALUES ($1, $2)`,
    [userId, postId]
  );
}

function updatePost(content, id) {
  const idPost = Number(id);
  return connectionDB.query(`UPDATE posts SET content=$1 WHERE id=$2`, [
    content,
    idPost,
  ]);
}

function deleteLikeFromPost(userId, postId) {
  return connectionDB.query(
    `DELETE FROM likes WHERE user_id=$1 AND post_id=$2`,
    [userId, postId]
  );
}

function deletePostHashTagRelation(id) {
  return connectionDB.query(`DELETE FROM posts_hashtags WHERE post_id = $1`, [
    id,
  ]);
}

function deletePostLikeRelation(id) {
  return connectionDB.query(`DELETE FROM likes WHERE post_id = $1`, [id]);
}

const postsRepository = {
  createPost,
  getPosts,
  getPostsByHashtag,
  getPostsByUserId,
  searchPost,
  deletePost,
  insertLikeToPost,
  updatePost,
  deleteLikeFromPost,
  deletePostHashTagRelation,
  deletePostLikeRelation,
};

export default postsRepository;
