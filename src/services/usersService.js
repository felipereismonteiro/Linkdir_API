import usersRepository from "../repositories/usersRepository.js";

async function getUsersByName(userId, name) {
    
    const users = await usersRepository.getUsersByName(userId, name);
    
    return users;
}

async function getUserInfo(userId) {
    const userInfo = await usersRepository.getUserInfos(userId);

    return userInfo;
}


const usersService = {
    getUsersByName,
    getUserInfo
}

export default usersService;