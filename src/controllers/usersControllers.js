import usersRepository from "../repositories/usersRepository.js";

export async function getUsersByName(req, res) {
    const { name } = req.query;
    
    try {
        const users = await usersRepository.getUsersByName(name);

        res.status(200).send(users.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}