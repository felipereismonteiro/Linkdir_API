import { connectionDB } from "../db/db.js";

export function postComment({ post_id, user_id, comment }) {
  return connectionDB.query(
    `INSERT INTO comments(post_id, user_id, comment) VALUES($1, $2, $3)`,
    [post_id, user_id, comment]
  );
}

export function getComment(id, userId) {
  return connectionDB.query(
  `
    SELECT 	comments.id, comments.post_id, users.user_name AS name, comments.comment,
    CASE 
      WHEN comments.user_id = followers_followed.followed_id THEN TRUE
    ELSE FALSE
      END AS following
    FROM comments 
    JOIN users 
      ON comments.user_id = users.id  
    JOIN followers_followed
      ON followers_followed.follower_id = $2
    WHERE comments.post_id = $1
  `, [id.id, userId])
}

const commentsRepository = {
  postComment,
};

export default commentsRepository;
