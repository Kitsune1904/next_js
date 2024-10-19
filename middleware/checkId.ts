import {ApiError} from "./ErrorApi";
import { Request, Response, NextFunction } from 'express';
import {string} from "joi";

export const checkUserId = (req: Request, res: Response, next: NextFunction): void => {
    const userId: string = req.headers['x-user-id'] as string;
    if (!userId) {
        throw new ApiError(401, 'Unauthorized')
    }
    req.userId = userId;
    next();
}