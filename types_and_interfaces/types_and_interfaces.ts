import crypto from "crypto";

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
    id: string,
    email: string,
    name: string,
    password?: string
}