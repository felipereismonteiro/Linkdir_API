import { connectionDB } from "../db/db.js";

export function getUsersByName(userId, name) {

  return connectionDB.query(
    `SELECT 
            users.id, users.user_name, users.profile_picture,
            CASE
                WHEN users.id = SOME (array_agg(followers_followed.followed_id))
                THEN true
                ELSE false
                END AS is_followed 
        FROM 
            users
        LEFT JOIN
            followers_followed
        ON
            followers_followed.follower_id = $1 
        WHERE 
            users.user_name ILIKE $2 || '%'
        GROUP BY 
            users.id
        ORDER BY 
            is_followed
        DESC   
        `,
    [userId, name]
  );
}

function getUserInfos(id) {
  return connectionDB.query(
    `WITH followers_quantity_cte AS (
    SELECT followed_id, COUNT(id) AS followers_quantity 
    FROM followers_followed
    GROUP BY followed_id
  ),
following_quantity_cte AS (
 SELECT follower_id, COUNT(id) AS following_quantity 
 FROM followers_followed
 GROUP BY follower_id
),
user_followers_cte AS (
SELECT followed_id, array_agg(jsonb_build_object('id',u.id, 'user_name', u.user_name,'profile_picture', u.profile_picture)) AS followers
FROM followers_followed
JOIN users u ON u.id = followers_followed.follower_id
GROUP BY followers_followed.followed_id
),
user_following_cte AS (
SELECT follower_id, array_agg(jsonb_build_object('id',u.id, 'user_name', u.user_name,'profile_picture', u.profile_picture)) AS following
FROM followers_followed
JOIN users u ON u.id = followers_followed.followed_id
GROUP BY followers_followed.follower_id
)
SELECT u.user_name, u.profile_picture, u.cover, u.biography, COALESCE(user_followers_cte.followers, '{}') AS followers, COALESCE(user_following_cte.following, '{}') AS following, COALESCE(followers_quantity_cte.followers_quantity, 0) AS followers_quantity, COALESCE(following_quantity_cte.following_quantity, 0) AS following_quantity
FROM users u
LEFT JOIN followers_quantity_cte ON u.id = followers_quantity_cte.followed_id
LEFT JOIN following_quantity_cte ON u.id = following_quantity_cte.follower_id
LEFT JOIN user_followers_cte ON u.id = user_followers_cte.followed_id
LEFT JOIN user_following_cte ON u.id = user_following_cte.follower_id
WHERE u.id=$1;`, [id]
  );
}

const usersRepository = {
  getUsersByName,
  getUserInfos,
};

export default usersRepository;
