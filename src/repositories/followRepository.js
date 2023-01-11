import { connectionDB } from "../db/db.js";

function followUser(userId, userToFollowId) {
  return connectionDB.query(
    `INSERT INTO followers_followed (follower_id, followed_id) VALUES ($1, $2)`,
    [userId, userToFollowId]
  );
}

function unfollowUser(userId, userToUnfollowId) {
  return connectionDB.query(
    `DELETE FROM followers_followed WHERE follower_id = $1 AND followed_id = $2`,
    [userId, userToUnfollowId]
  );
}

function getFollowStatus(userId, userPageId) {
  return connectionDB.query(
    `SELECT
         CASE
         WHEN $2 = SOME (array_agg(followed_id))
         THEN true
         ELSE false
         END AS is_followed
    FROM 
        followers_followed
    WHERE
        follower_id = $1 
                        `,
    [userId, userPageId]
  );
}

const followRespository = {
  getFollowStatus,
  followUser,
  unfollowUser,
};

export default followRespository;
