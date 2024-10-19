import crypto from "crypto";
import bcrypt from "bcrypt";
import {users} from "../../repository/storage.js";
import {ApiError} from "../../middleware/ErrorApi.js";
import Joi, {ObjectSchema} from "joi";
import {IUser} from "../../models/models";
import jwt from 'jsonwebtoken'
import {JWT_KEY} from "../../constants";


export const userValidationSchema: ObjectSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .max(254)
        .label('Email')
        .required(),
    name: Joi.string()
        .min(2)
        .label('User name')
        .required(),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[?!@#$%^&*])[A-Za-z\\d?!@#$%^&*]+$'))
        .label('Password')
        .required()
})

export const signupNewUser = async (newUser: IUser): Promise<IUser> => {
    await userValidationSchema.validateAsync(newUser).catch(error => {
        throw new ApiError(400, error.details[0].message);
    });

    const isUserExist: boolean = users.some((user: IUser): boolean => user.email === newUser.email)
    if (isUserExist) {
        throw new ApiError(409, `User ${newUser.email} doesn\'t exist`)
    }
        const newUserShown: IUser = {
            id: crypto.randomUUID(),
            email: newUser.email,
            name: newUser.name,
            role: "CUSTOMER"
        }
        const hashedPassword: string = await bcrypt.hash(newUser.password as string, 10) ;
        users.push({
            ...newUserShown,
            password: hashedPassword
        })
    return newUserShown
}

export const loginUser = async (email: string, password: string) => {
    const currentUser: IUser | undefined = users.find((user: IUser): boolean => user.email === email);
    if (!currentUser) {
        throw new ApiError(404, `User ${email} doesn\'t exist`)
    }
    const match = await bcrypt.compare(password, currentUser.password!);

    if(!match) {
        throw new ApiError(401, `Invalid password`)
    }

    const token: string = jwt.sign({ role: currentUser.role }, JWT_KEY, { expiresIn: '1h' })
    return token
}

