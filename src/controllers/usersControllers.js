import usersService from "../services/usersService.js";

export async function getUsersByName(req, res) {
  const { name } = req.query;
  const userId = res.locals.userId;

  try {
    const users = await usersService.getUsersByName(userId, name);
    res.status(200).send(users.rows);
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message);
  }
} 

export async function getUserInfo(req, res) {
  const { userId } = req.body;

  try {
    const userInfo = await usersService.getUserInfo(userId);

    res.status(200).send(userInfo)
  } catch (err) {
    res.status(500).send(err.message);
  }
}