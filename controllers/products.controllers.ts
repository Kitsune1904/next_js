import {products} from "../repository/storage";
import {ApiError} from "../middleware/ErrorApi";
import {uploadEvents} from "../middleware/eventEmmiter";
import stream from "stream";
import csv from "csv-parser";
import crypto from "crypto";
import fs from "fs/promises";
import {PRODUCTS_FILE} from "../constants";
import {addProductInStorage, getProduct} from "../services/products/products.services";
import { Request, Response } from 'express';
import {TProductCSV} from "../models/models";
import {PassThrough} from "node:stream";


/**
 * Receives a request to show all products from storage.
 * Response in json format by array of product objects from storage.
 * @param req
 * @param res
 */
export const getAllProducts = (req: Request, res: Response): void => {
    res.status(200).json(products)
}
/**
 * Receives a request to show product from storage y it's ID.
 * Response in json format by product object from storage using product ID
 * @param req
 * @param res
 */
export const getProductById = (req: Request, res: Response): void => {
    res.status(200).json(getProduct(req))
}

/**
 * Receives a request to add a new product in products.storage.json
 * Response by new added product
 * @param req
 * @param res
 * @return {Promise<void>}
 */
export const addProduct = async (req: Request, res: Response): Promise<void> => {
    const product: TProductCSV = await addProductInStorage(req.body)
    res.status(200).json({
        message: 'Product added',
        data: product
    })
}

/**
 * Receives a request to reed info from downloaded file in csv format, if file isn't missed
 * it will read it from memory and create products.storage.json file with parsed info from
 * downloaded file
 * @param req
 * @param res
 * @return {Promise<void>}
 */
export const handleProductsFileImport = async (req: Request, res: Response): Promise<void> =>  {
    if (!req.file) {
        throw new ApiError(400, 'File to upload is absent')
    }

    uploadEvents.emit('fileUploadStart');
    const products: TProductCSV[] = [];
    const readableStream: PassThrough = new stream.PassThrough();
    readableStream.end(req.file.buffer);
    readableStream
        .pipe(csv())
        .on('data', (data) => products.push({
            id: crypto.randomUUID(),
            name: data.name,
            description: data.description,
            category: data.category,
            price: parseFloat(data.price)
        }))
        .on('end', (): void => {
            fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
            uploadEvents.emit('fileUploadEnd');
            res.status(200).json({ message: 'File successfully uploaded and processed' });
        })
        .on('error', (): void => {
            uploadEvents.emit('fileUploadFailed');
            throw new ApiError(500, 'Failed to process file')
        });
}