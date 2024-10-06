"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewUser = exports.userValidationSchema = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const storage_js_1 = require("../../repository/storage.js");
const ErrorApi_js_1 = require("../../middleware/ErrorApi.js");
const joi_1 = __importDefault(require("joi"));
exports.userValidationSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email({ tlds: { allow: false } })
        .max(254)
        .label('Email')
        .required(),
    name: joi_1.default.string()
        .min(2)
        .label('User name')
        .required(),
    password: joi_1.default.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[?!@#$%^&*])[A-Za-z\\d?!@#$%^&*]+$'))
        .label('Password')
        .required()
});
const createNewUser = (newUser) => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.userValidationSchema.validateAsync(newUser).catch(error => {
        throw new ErrorApi_js_1.ApiError(400, error.details[0].message);
    });
    const isUserExist = storage_js_1.users.some((user) => user.email === newUser.email);
    if (isUserExist) {
        throw new ErrorApi_js_1.ApiError(409, `User ${newUser.email} exist`);
    }
    const newUserShown = {
        id: crypto_1.default.randomUUID(),
        email: newUser.email,
        name: newUser.name,
    };
    const hashedPassword = yield bcrypt_1.default.hash(newUser.password, 10);
    storage_js_1.users.push(Object.assign(Object.assign({}, newUserShown), { password: hashedPassword }));
    return newUserShown;
});
exports.createNewUser = createNewUser;
