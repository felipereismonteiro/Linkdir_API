import { connectionDB } from "../db/db.js";

async function insertUser(
  user_name,
  email,
  newPassword,
  profile_picture,
) {
    try {
        await connectionDB.query(
            `INSERT INTO users(user_name, email, password, profile_picture) VALUES($1, $2, $3, $4)`,
            [user_name, email, newPassword, profile_picture]
        );
    } catch(err) {
        return err;
    }
}

async function getUserById(id){
  return connectionDB.query(`SELECT * FROM users WHERE id=$1`,[id])
}

const authRepository = {
    insertUser,
    getUserById
} 

export default authRepository;