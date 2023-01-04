import { connectionDB } from "../db/db.js";


async function createPost(user_id, content, url) {
	return connectionDB.query("INSERT INTO posts (user_id, content, url) VALUES($1, $2, $3) RETURNING id;",[user_id, content, url])
}

async function getPosts() {
    return connectionDB.query("SELECT posts.*, users.user_name FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.id DESC LIMIT 20;")
}

const postsRepository = {
    createPost,
    getPosts
}

export default postsRepository;