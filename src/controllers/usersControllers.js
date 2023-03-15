import usersService from "../services/usersService.js";

export async function getUsersByName(req, res) {
  const { name } = req.query;
  const userId = res.locals.userId;

  try {
    const users = await usersService.getUsersByName(userId, name);

    res.status(200).send(users.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
} 
