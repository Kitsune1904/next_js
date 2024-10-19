import { Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import {JWT_KEY} from "../constants";
import {ApiError} from "./ErrorApi";
import {CustomRequest, IToken} from "../models/models";

export const auth = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const token: string = req.cookies.token as string;
    if (!token) {
        throw new ApiError(401, 'Unauthorized');
    }
    try {
        const decodedData: IToken = jwt.verify(token, JWT_KEY) as IToken;
        req.user = decodedData;
        next();
    } catch (error) {
        throw new ApiError(401, 'Invalid token');
    }
}

