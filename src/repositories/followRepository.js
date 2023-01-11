import { connectionDB } from "../db/db.js";

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
};

export default followRespository;
