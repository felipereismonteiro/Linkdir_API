import usersRepository from "../repositories/usersRepository.js";

async function getUsersByName(userId, name) {
    const users = await usersRepository.getUsersByName(userId, name);

    return users;
}


const usersService = {
    getUsersByName
}

export default usersService;