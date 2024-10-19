import {ApiError} from "./ErrorApi";
import { Response, NextFunction } from 'express';
import {CustomRequest} from "../models/models";

export const checkUserId = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const userId: string = req.headers['x-user-id'] as string;
    if (!userId) {
        throw new ApiError(401, 'Unauthorized')
    }
    req.userId = userId;
    next();
}