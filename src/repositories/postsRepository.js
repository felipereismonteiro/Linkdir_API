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
    ;`
    , [userId,id])
}

function searchPost(id) {
  return connectionDB.query(`SELECT * FROM posts WHERE id=$1`, [id]);
}

function deletePost(id) {
  const promisse1 = connectionDB.query(`DELETE FROM likes WHERE post_id=$1;`, [id]);
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
  return connectionDB.query(`UPDATE posts SET content=$1 WHERE id=$2`, [content, idPost]);

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
  getPostsByUserId,
  searchPost,
  deletePost,
  insertLikeToPost,
  updatePost,
  deleteLikeFromPost,
};

export default postsRepository;
