import { Request } from 'express';

export interface ICart {
    id: string;
    userId: number;
    products: TProduct[];
}

export type TProduct = {
    id: number;
    title: string;
    description: string;
    price: number;
}

export interface IOrder {
    id: string;
    userId: number;
    products: TProduct[];
    totalPrice: number;
}

export type TProductCSV = {
    id?: string
    name: string;
    description: string;
    category: string;
    price: number;
}

export interface IUser {
    id?: string,
    email: string,
    name: string,
    password?: string,
    role: "ADMIN" | "CUSTOMER"
}

export interface IToken {
    role: string
}

export type CustomRequest = Request & {
    userId?: string;
    user?: IToken;
};


