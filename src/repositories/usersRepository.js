import { connectionDB } from "../db/db.js";


export function getUsersByName(name) {
    return connectionDB.query("SELECT id, user_name, profile_picture FROM users WHERE user_name ILIKE $1 || '%';", [name])
}

const usersRepository = {
    getUsersByName
}

export default usersRepository;