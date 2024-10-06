import {createNewUser} from "../services/user/user.services.js";
import {IUser} from "../types_and_interfaces/types_and_interfaces";
import { Request, Response } from 'express';

/**
 * Receives a request to singUp a new user
 * Response by user info
 * @param req
 * @param res
 * @return {Promise<void>}
 */
export const signUp = async (req: Request, res: Response): Promise<void> => {
    const newUser: IUser = await createNewUser(req.body)
    res.status(201).json(newUser)
}