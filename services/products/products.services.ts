import {ApiError} from "../../middleware/ErrorApi";
import fs from "fs/promises";
import {PRODUCTS_FILE} from "../../constants";
import crypto from "crypto";
import {products} from "../../repository/storage";
import {TProduct, TProductCSV} from "../../models/models";
import { Request, Response } from 'express';

/**
 * Creates new product
 * @param body
 * @return TProductCSV
 */
export const createNewProduct = (body: TProductCSV) : TProductCSV => {
    const { name, description, category, price } = body;

    if(!name || !description || !category || !price ) {
        throw new ApiError(400, 'Missing required fields')
    }
    return {name, description, category, price}
}


export const getProductsStorage =  async (): Promise<TProductCSV[] | []> => {
    try {
        const data: string = await fs.readFile(PRODUCTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};



export const addProductInStorage = async (body: TProductCSV): Promise<TProductCSV> => {
    const product: TProductCSV = createNewProduct(body)
    const productsStore: TProductCSV[] = await getProductsStorage();

    if (productsStore.length > 0) {
        const isProdExist: number = productsStore.findIndex((prod: TProductCSV): boolean => prod.name === product.name);
        if (isProdExist !== -1) {
            throw new ApiError(409, 'Product exist')
        }
    }

    productsStore.push({
        id: crypto.randomUUID(),
        ...product
    });

    try {
        await fs.writeFile(PRODUCTS_FILE, JSON.stringify(productsStore, null, 2), 'utf8')
    } catch (err) {
        throw new ApiError(500, 'Error adding data');
    }
    return product
}

export const getProduct = (req: Request): TProduct => {
    const productId: number = Number(req.params.id);
    if (isNaN(productId)) {
        throw new ApiError(400, 'Wrong id format')
    }
    const product: TProduct | undefined = products.find(prod => prod.id === productId);
    if (!product) {
        throw new ApiError(404, 'Product not found')
    }
    return product
}
