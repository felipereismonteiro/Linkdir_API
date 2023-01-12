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
        JOIN
            followers_followed
        ON
            followers_followed.follower_id = $1 
        WHERE 
            users.user_name ILIKE $2 || '%'
        GROUP BY 
            users.id
        ORDER BY 
            is_followed
        
        `,
    [userId, name]
  );
}

const usersRepository = {
  getUsersByName,
};

export default usersRepository;
