import { connectionDB } from "../db/db.js";

async function createPost(user_id, content, url, title, description, image) {
  return connectionDB.query(
    "INSERT INTO posts (user_id, content, url, url_title, url_description, url_image) VALUES($1, $2, $3, $4, $5, $6) RETURNING id;",
    [user_id, content, url, title, description, image]
  );
}

async function getPosts(userId) {
  return connectionDB.query(
    `WITH likes_posts_cte AS (
      SELECT post_id, COUNT(id) AS likes 
      FROM likes 
      GROUP BY post_id
    ),
    liked_by_posts_cte AS (
      SELECT post_id, array_agg(jsonb_build_object('id',u.id, 'user_name', u.user_name)) AS liked_by,
      CASE 
          WHEN $1 = ANY (array_agg(u.id)) THEN true
          ELSE false 
          END AS is_liked
      FROM likes
      JOIN 
            users u 
        ON 
            u.id = likes.user_id
      GROUP BY likes.post_id
    ),
    comments_posts_cte AS (
      SELECT post_id, COUNT(id) AS comments_amount
      FROM comments
      GROUP BY post_id
    ),
    comments_text_posts_cte AS (
      SELECT post_id, array_agg(jsonb_build_object('user_id', u.id, 'user_name', u.user_name, 'user_picture', u.profile_picture , 'comment', comments.comment)) AS comments
      FROM comments
      JOIN 
            users u 
        ON 
            u.id = comments.user_id
      GROUP BY comments.post_id
    ),
    shares_posts_cte AS (
      SELECT post_id, COUNT(id) AS shares
      FROM shares
      GROUP BY post_id
    ),
    likes_shares_cte AS (
      SELECT post_id, COUNT(id) AS likes 
      FROM likes 
      GROUP BY post_id
    ),
    liked_by_shares_cte AS (
      SELECT post_id, array_agg(jsonb_build_object('id',u.id, 'user_name', u.user_name)) AS liked_by,
      CASE 
      WHEN $1 = ANY (array_agg(u.id)) THEN true
      ELSE false 
      END AS is_liked
      FROM likes
      JOIN 
            users u 
        ON 
            u.id = likes.user_id
      GROUP BY likes.post_id
    ),
    comments_shares_cte AS (
      SELECT post_id, COUNT(id) AS comments_amount
      FROM comments
      GROUP BY post_id
    ),
    comments_text_shares_cte AS (
      SELECT post_id, array_agg(jsonb_build_object('user_id', u.id, 'user_name', u.user_name, 'user_picture', u.profile_picture , 'comment', comments.comment)) AS comments
      FROM comments
      JOIN 
            users u 
        ON 
            u.id = comments.user_id
      GROUP BY comments.post_id
    ),
    shares_shares_cte AS (
      SELECT post_id, COUNT(id) AS shares
      FROM shares
      GROUP BY post_id
    )
    SELECT p1.id, p1.user_id, p1.content, p1.url, shares.created_at, p1.url_title, p1.url_description,
        p1.url_image, u1.user_name AS user_name, u1.profile_picture, u2.user_name AS shared_by, u2.id AS post_share_user, shares.id AS post_share_id,
      'share' AS type, COALESCE(likes_shares_cte.likes, 0) AS likes, COALESCE(comments_shares_cte.comments_amount, 0) AS comments_amount, COALESCE(shares_shares_cte.shares, 0) shares,
      liked_by_shares_cte.liked_by, liked_by_shares_cte.is_liked, comments_text_shares_cte.comments
      FROM 
        shares 
      JOIN 
        posts p1 
      ON 
        shares.post_id = p1.id 
      JOIN 
        users u1 
      ON 
        p1.user_id = u1.id 
      JOIN 
        users u2 
      ON 
        shares.user_id = u2.id
      LEFT JOIN 
        likes 
      ON 
        likes.post_id = p1.id
    LEFT JOIN
        likes_shares_cte
      ON
        likes_shares_cte.post_id = p1.id
    LEFT JOIN
      liked_by_shares_cte
    ON
      liked_by_shares_cte.post_id = p1.id
      LEFT JOIN
        comments_shares_cte
      ON
        comments_shares_cte.post_id = p1.id
    LEFT JOIN
      comments_text_shares_cte
    ON
      comments_text_shares_cte.post_id = p1.id
    LEFT JOIN
        comments
      ON
        comments.post_id = p1.id
      LEFT JOIN 
        users u4
      ON
        comments.user_id = u4.id
    LEFT JOIN
    shares_shares_cte
    ON
    shares_shares_cte.post_id = p1.id
      GROUP BY 
        p1.id, shares.created_at, shares.id, u1.user_name, u1.profile_picture, u2.user_name, u2.id, likes_shares_cte.likes, comments_shares_cte.comments_amount, shares_shares_cte.shares, liked_by_shares_cte.liked_by, liked_by_shares_cte.is_liked, comments_text_shares_cte.comments
      UNION ALL
      SELECT 
        p1.*, u1.user_name, u1.profile_picture, NULL AS shared_by, u1.id AS post_share_user, p1.id AS post_share_id,
        'post' AS type, COALESCE(likes_posts_cte.likes, 0) AS likes, COALESCE(comments_posts_cte.comments_amount, 0) AS comments_amount, COALESCE(shares_posts_cte.shares, 0) AS shares,
        liked_by_posts_cte.liked_by, liked_by_posts_cte.is_liked, comments_text_posts_cte.comments 
      FROM 
        posts p1 
      JOIN 
        users u1 
      ON 
        p1.user_id = u1.id
      LEFT JOIN 
        shares 
      ON 
        shares.post_id = p1.id
    LEFT JOIN
        shares_posts_cte
      ON
        shares_posts_cte.post_id = p1.id
      LEFT JOIN 
        likes 
      ON 
        likes.post_id = p1.id
    LEFT JOIN
        likes_posts_cte
      ON
        likes_posts_cte.post_id = p1.id
    LEFT JOIN
      liked_by_posts_cte
    ON
      liked_by_posts_cte.post_id = p1.id
      LEFT JOIN
        comments
      ON
        comments.post_id = p1.id
    LEFT JOIN
        comments_posts_cte
      ON
        comments_posts_cte.post_id = p1.id
    LEFT JOIN
      comments_text_posts_cte
    ON
      comments_text_posts_cte.post_id = p1.id
      LEFT JOIN 
        users u3
      ON
        comments.user_id = u3.id
      GROUP BY 
        p1.id, u1.id, u1.user_name, u1.profile_picture, likes_posts_cte.likes, comments_posts_cte.comments_amount, shares_posts_cte.shares, liked_by_posts_cte.liked_by, liked_by_posts_cte.is_liked, comments_text_posts_cte.comments
      ORDER BY created_at DESC 
      LIMIT 
        20;`,
    [userId] 
  );
}

// WITH likes_posts_cte AS (
//   SELECT post_id, COUNT(id) AS likes 
//   FROM likes 
//   GROUP BY post_id
// ),
// liked_by_posts_cte AS (
//   SELECT post_id, array_agg(jsonb_build_object('id',u.id, 'user_name', u.user_name)) AS liked_by,
//   CASE 
//       WHEN 17 = ANY (array_agg(u.id)) THEN true
//       ELSE false 
//       END AS is_liked
//   FROM likes
//   JOIN 
//         users u 
//     ON 
//         u.id = likes.user_id
//   GROUP BY likes.post_id
// ),
// comments_posts_cte AS (
//   SELECT post_id, COUNT(id) AS comments_amount
//   FROM comments
//   GROUP BY post_id
// ),
// comments_text_posts_cte AS (
//   SELECT post_id, array_agg(jsonb_build_object('user_id', u.id, 'user_name', u.user_name, 'user_picture', u.profile_picture , 'comment', comments.comment)) AS comments
//   FROM comments
//   JOIN 
//         users u 
//     ON 
//         u.id = comments.user_id
//   GROUP BY comments.post_id
// ),
// shares_posts_cte AS (
//   SELECT post_id, COUNT(id) AS shares
//   FROM shares
//   GROUP BY post_id
// ),
// likes_shares_cte AS (
//   SELECT post_id, COUNT(id) AS likes 
//   FROM likes 
//   GROUP BY post_id
// ),
// liked_by_shares_cte AS (
//   SELECT post_id, array_agg(jsonb_build_object('id',u.id, 'user_name', u.user_name)) AS liked_by,
//   CASE 
//   WHEN 17 = ANY (array_agg(u.id)) THEN true
//   ELSE false 
//   END AS is_liked
//   FROM likes
//   JOIN 
//         users u 
//     ON 
//         u.id = likes.user_id
//   GROUP BY likes.post_id
// ),
// comments_shares_cte AS (
//   SELECT post_id, COUNT(id) AS comments_amount
//   FROM comments
//   GROUP BY post_id
// ),
// comments_text_shares_cte AS (
//   SELECT post_id, array_agg(jsonb_build_object('user_id', u.id, 'user_name', u.user_name, 'user_picture', u.profile_picture , 'comment', comments.comment)) AS comments
//   FROM comments
//   JOIN 
//         users u 
//     ON 
//         u.id = comments.user_id
//   GROUP BY comments.post_id
// ),
// shares_shares_cte AS (
//   SELECT post_id, COUNT(id) AS shares
//   FROM shares
//   GROUP BY post_id
// )
// SELECT p1.id, p1.user_id, p1.content, p1.url, shares.created_at, p1.url_title, p1.url_description,
//     p1.url_image, u1.user_name AS user_name, u1.profile_picture, u2.user_name AS shared_by, u2.id AS post_share_user, shares.id AS post_share_id,
//   'share' AS type, COALESCE(likes_shares_cte.likes, 0) AS likes, COALESCE(comments_shares_cte.comments_amount, 0) AS comments_amount, COALESCE(shares_shares_cte.shares, 0) shares,
//   liked_by_shares_cte.liked_by, liked_by_shares_cte.is_liked, comments_text_shares_cte.comments
//   FROM 
//     shares 
//   JOIN 
//     posts p1 
//   ON 
//     shares.post_id = p1.id 
//   JOIN 
//     users u1 
//   ON 
//     p1.user_id = u1.id 
//   JOIN 
//     users u2 
//   ON 
//     shares.user_id = u2.id
//   LEFT JOIN 
//     likes 
//   ON 
//     likes.post_id = p1.id
// LEFT JOIN
//     likes_shares_cte
//   ON
//     likes_shares_cte.post_id = p1.id
// LEFT JOIN
//   liked_by_shares_cte
// ON
//   liked_by_shares_cte.post_id = p1.id
//   LEFT JOIN
//     comments_shares_cte
//   ON
//     comments_shares_cte.post_id = p1.id
// LEFT JOIN
//   comments_text_shares_cte
// ON
//   comments_text_shares_cte.post_id = p1.id
// LEFT JOIN
//     comments
//   ON
//     comments.post_id = p1.id
//   LEFT JOIN 
//     users u4
//   ON
//     comments.user_id = u4.id
// LEFT JOIN
// shares_shares_cte
// ON
// shares_shares_cte.post_id = p1.id
//   GROUP BY 
//     p1.id, shares.created_at, shares.id, u1.user_name, u1.profile_picture, u2.user_name, u2.id, likes_shares_cte.likes, comments_shares_cte.comments_amount, shares_shares_cte.shares, liked_by_shares_cte.liked_by, liked_by_shares_cte.is_liked, comments_text_shares_cte.comments
//   UNION ALL
//   SELECT 
//     p1.*, u1.user_name, u1.profile_picture, NULL AS shared_by, u1.id AS post_share_user, p1.id AS post_share_id,
//     'post' AS type, COALESCE(likes_posts_cte.likes, 0) AS likes, COALESCE(comments_posts_cte.comments_amount, 0) AS comments_amount, COALESCE(shares_posts_cte.shares, 0) AS shares,
//     liked_by_posts_cte.liked_by, liked_by_posts_cte.is_liked, comments_text_posts_cte.comments 
//   FROM 
//     posts p1 
//   JOIN 
//     users u1 
//   ON 
//     p1.user_id = u1.id
//   LEFT JOIN 
//     shares 
//   ON 
//     shares.post_id = p1.id
// LEFT JOIN
//     shares_posts_cte
//   ON
//     shares_posts_cte.post_id = p1.id
//   LEFT JOIN 
//     likes 
//   ON 
//     likes.post_id = p1.id
// LEFT JOIN
//     likes_posts_cte
//   ON
//     likes_posts_cte.post_id = p1.id
// LEFT JOIN
//   liked_by_posts_cte
// ON
//   liked_by_posts_cte.post_id = p1.id
//   LEFT JOIN
//     comments
//   ON
//     comments.post_id = p1.id
// LEFT JOIN
//     comments_posts_cte
//   ON
//     comments_posts_cte.post_id = p1.id
// LEFT JOIN
//   comments_text_posts_cte
// ON
//   comments_text_posts_cte.post_id = p1.id
//   LEFT JOIN 
//     users u3
//   ON
//     comments.user_id = u3.id
//   GROUP BY 
//     p1.id, u1.id, u1.user_name, u1.profile_picture, likes_posts_cte.likes, comments_posts_cte.comments_amount, shares_posts_cte.shares, liked_by_posts_cte.liked_by, liked_by_posts_cte.is_liked, comments_text_posts_cte.comments
//   ORDER BY created_at DESC 
//   LIMIT 
//     20;

function getPostsByHashtag(userId, id) {
  return connectionDB.query(
    ` SELECT 
    posts.*, users.user_name, users.profile_picture, COUNT (likes.post_id) AS likes, array_agg(
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

function sharePost(postId, userId) {
  return connectionDB.query("INSERT INTO shares (post_id, user_id) VALUES ($1, $2);", [postId, userId])
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
  sharePost,
};

export default postsRepository;
