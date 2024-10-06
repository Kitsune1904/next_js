"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserId = void 0;
const ErrorApi_1 = require("./ErrorApi");
const checkUserId = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        throw new ErrorApi_1.ApiError(401, 'Unauthorized');
    }
    req.userId = userId;
    next();
};
exports.checkUserId = checkUserId;
