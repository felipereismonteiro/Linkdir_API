import { connectionDB } from "../db/db.js";

export function postComment({ post_id, user_id, comment }) {
  return connectionDB.query(
    `INSERT INTO comments(post_id, user_id, comment) VALUES($1, $2, $3)`,
    [post_id, user_id, comment]
  );
}

const commentsRepository = {
  postComment,
};

export default commentsRepository;
