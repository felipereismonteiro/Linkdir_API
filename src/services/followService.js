import followRespository from "../repositories/followRepository.js";

async function followUser(userId, userToFollowId) {
  
    await followRespository.followUser(userId, userToFollowId);
  
  }

  export async function unfollowUser(userId, userToFollowId) {

    await followRespository.unfollowUser(userId, userToFollowId);
  
  }

  const followService = {
    followUser,
    unfollowUser
  }

  export default followService;