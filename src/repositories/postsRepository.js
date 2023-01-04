import { connectionDB } from "../db/db.js";

async function createUser(user_id, content, url) {
	return connectionDB.query("INSERT INTO posts (user_id, content, url) VALUES($1, $2, $3);",[user_id, content, url])
}

async function getUsers() {
    return connectionDB.query("SELECT * FROM users;")
}

const postsRepository = {
    createUser,
    getUsers
}

export default postsRepository;