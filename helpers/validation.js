import Joi from 'joi';

export const userValidationSchema = Joi.object({
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



