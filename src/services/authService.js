import authRepository from "../repositories/authRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function signUp(user_name, email, password, profile_picture) {
    const newPassword = bcrypt.hashSync(password, 10);

    await authRepository.insertUser(user_name, email, newPassword, profile_picture);
}

const authService = {
    signUp
}

export default authService; 