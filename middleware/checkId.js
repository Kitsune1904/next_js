import {ApiError} from "./ErrorApi.js";

export const checkUserId = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        throw new ApiError(401, 'Unauthorized')
    }
    req.userId = userId;
    next();
}