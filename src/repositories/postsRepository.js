import { connectionDB } from "../db/db.js";

async function createPost(user_id, content, url, title, description, image) {
  return connectionDB.query(
    "INSERT INTO posts (user_id, content, url, url_title, url_description, url_image) VALUES($1, $2, $3, $4, $5, $6) RETURNING id;",
    [user_id, content, url, title, description, image]
  );
}

async function getPosts(userId) {
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
    GROUP BY
      posts.id, users.user_name, users.profile_picture 
    ORDER BY 
      posts.id DESC 
    LIMIT 
      20;`,
    [userId]
  );
}

function getPostsByHashtag(id) {
  return connectionDB.query(
    `SELECT * FROM posts WHERE id IN (SELECT post_id FROM posts_hashtags WHERE hashtag_id = $1)`,
    [id]
  );
}

function searchPost(id) {
  return connectionDB.query(`SELECT * FROM posts WHERE id=$1`, [id]);
}

function deletePost(id) {
  return connectionDB.query(`DELETE FROM posts WHERE id=$1`, [id]);
}

function insertLikeToPost(userId, postId) {
  return connectionDB.query(
    `INSERT INTO likes (user_id, post_id) VALUES ($1, $2)`,
    [userId, postId]
  );
}

function updatePost(field, content, id) {
  return connectionDB.query(`UPDATE posts SET ${field}=$1 WHERE id=$2`, [
    content,
    id,
  ]);
}

function updatePutPost(content, url, id) {
  return connectionDB.query(`UPDATE posts SET content=$1, url=$2 WHERE id=$3`, [
    content,
    url,
    id,
  ]);
}

function deleteLikeFromPost(userId, postId) {
  return connectionDB.query(
    `DELETE FROM likes WHERE user_id=$1 AND post_id=$2`,
    [userId, postId]
  );
}

const postsRepository = {
  createPost,
  getPosts,
  getPostsByHashtag,
  searchPost,
  deletePost,
  insertLikeToPost,
  updatePost,
  updatePutPost,
  deleteLikeFromPost,
};

export default postsRepository;
