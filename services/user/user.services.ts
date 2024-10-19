import crypto from "crypto";
import bcrypt from "bcrypt";
import {users} from "../../repository/storage.js";
import {ApiError} from "../../middleware/ErrorApi.js";
import Joi, {ObjectSchema} from "joi";
import {IUser} from "../../models/models";

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

export const createNewUser = async (newUser: IUser): Promise<IUser> => {
    await userValidationSchema.validateAsync(newUser).catch(error => {
        throw new ApiError(400, error.details[0].message);
    });

    const isUserExist: boolean = users.some((user: IUser): boolean => user.email === newUser.email)
    if (isUserExist) {
        throw new ApiError(409, `User ${newUser.email} exist`)
    }
        const newUserShown: IUser = {
            id: crypto.randomUUID(),
            email: newUser.email,
            name: newUser.name,
        }
        const hashedPassword: string = await bcrypt.hash(newUser.password as string, 10) ;
        users.push({
            ...newUserShown,
            password: hashedPassword
        })
    return newUserShown
}