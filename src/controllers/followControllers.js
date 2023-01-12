import followRespository from "../repositories/followRepository.js";

export async function followUser(req, res) {
  const userId = res.locals.userId;
  const { userToFollowId } = req.params;

  try {
    await followRespository.followUser(userId, userToFollowId);

    res.send(true);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function unfollowUser(req, res) {
  const userId = res.locals.userId;
  const { userToFollowId } = req.params;

  try {
    await followRespository.unfollowUser(userId, userToFollowId);

    res.send(false);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
