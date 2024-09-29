import {products} from "../storages/storage.js";
import {ApiError} from "./ErrorApi.js";
import * as path from "path";
import fs from 'fs/promises';

export const getProductStorage =  async () => {
    try {
        const data = await fs.readFile('storages/products.store.json', 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return [];
        } else if (err instanceof SyntaxError) {
            throw new ApiError(500, 'Error parsing JSON');
        } else {
            throw new ApiError(500, 'Error reading file');
        }
    }
};

export const addProductInStorage = async (appendData) => {
    const productsStore = await getProductStorage();

    if (productsStore.length > 0) {
        const isProdExist = productsStore.findIndex(prod => prod.name === appendData.name);
        if (isProdExist !== -1) {
            throw new ApiError(409, 'Product exist')
        }
    }

    productsStore.push(appendData);

    try {
        await fs.writeFile('storages/products.store.json', JSON.stringify(productsStore), 'utf8')
    } catch (err) {
        throw new ApiError(500, 'Error adding data');
    }
}


export const errorHandler = (err, req, res) => {
    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error'
    });
}

export const checkUserId = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        throw new ApiError(401, 'Unauthorized')
    }
    req.userId = userId;
    next();
}

export const getProduct = (req, res) => {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
        throw new ApiError(400, 'Wrong id format')
    }
    const product = products.find(prod => prod.id === productId);
    if (!product) {
        throw new ApiError(404, 'Product not found')
    }
    return product
}

export const getDate = () => {
    return new Date().toISOString().replace('T', ' ').split('.')[0]
}