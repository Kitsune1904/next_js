import { Request, Response } from 'express';
import {ApiError} from "./ErrorApi";

export const errorHandler = (err: ApiError, req: Request, res: Response): void => {
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error'
    });
}