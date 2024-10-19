import { Response, NextFunction } from 'express';
import {CustomRequest} from "../models/models";
import {ApiError} from "./ErrorApi";

export const adminOnly = (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'ADMIN') {
        throw new ApiError(403,'Access denied: Admins only' )
    }
    next();
};