import followRespository from "../repositories/followRepository.js";

export async function followUser(req, res) {
  const userId = res.locals.userId;
  const { userToFollowId } = req.params;

  try {
    await followRespository.followUser(userId, userToFollowId);

    res.sensStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

