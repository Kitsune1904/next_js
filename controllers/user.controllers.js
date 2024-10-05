import {createNewUser} from "../services/user/user.services.js";

/**
 * Receives a request to singUp a new user
 * Response by user info
 * @param req
 * @param res
 * @return {Promise<void>}
 */
export const signUp = async (req,res) => {
    const newUser = await createNewUser(req.body)
    res.status(201).json(newUser)
}