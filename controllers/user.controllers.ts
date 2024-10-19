import {loginUser, signupNewUser} from "../services/user/user.services.js";
import {CustomRequest, IUser} from "../models/models";
import { Response } from 'express';
import exp from "node:constants";

/**
 * Receives a request to singUp a new user
 * Response by user info
 * @param req
 * @param res
 * @return {Promise<void>}
 */
export const signUp = async (req: CustomRequest, res: Response): Promise<void> => {
    const newUser: IUser = await signupNewUser(req.body)
    res.status(201).json(newUser)
}

export const login = async (req: CustomRequest, res: Response): Promise<void> => {
    const userToken: string = await loginUser(req.body.email, req.body.password);
    res.cookie('token', userToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
    });
    res.status(200).json(userToken)
}