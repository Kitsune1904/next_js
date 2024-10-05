import {addProductInStorage, getProduct} from "../helpers/helpers.js";
import {carts, orders, products, users} from "../storages/storage.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import {ApiError} from "../helpers/ErrorApi.js";
import { userValidationSchema} from "../helpers/validation.js";
import { EventEmitter } from 'events';
import fs, { unlink } from 'fs/promises';
import csv from "csv-parser";
import {LOG_FILE, PRODUCTS_FILE} from "../helpers/constants.js";
import * as stream from "stream";

const uploadEvents = new EventEmitter();

async function logEvent(message) {
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
    const logMessage = `${timestamp} - ${message}\n`;
    await fs.appendFile(LOG_FILE, logMessage, (err) => {
        if(err) {
            console.error('Error appending data to file:', err);
        }
    });
}

uploadEvents.on('fileUploadStart', async () => await logEvent('File upload has started'));
uploadEvents.on('fileUploadEnd', async () => await logEvent('File has been uploaded'));
uploadEvents.on('fileUploadFailed', async (error) => await logEvent(`Error occurred, file upload failed: ${error}`));

export const registrationUser = async (req, res) => {
    const newUser = req.body

    await userValidationSchema.validateAsync(newUser).catch(error => {
        throw new ApiError(400, error.details[0].message);
    });

    const isUserExist = users.some(user => user.email === newUser.email)
    if (isUserExist) {
        throw new ApiError(409, `User ${newUser.email} exist`)
    }

    const newUserShown = {
        id: crypto.randomUUID(),
        email: newUser.email,
        name: newUser.name,
    }
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    users.push({
        ...newUserShown,
        password: hashedPassword
    })
    res.status(201).json(newUserShown)
}

export const getAllProducts = (req, res) => {
    res.status(200).json(products)
}

export const getProdById = (req, res) => {
    res.status(200).json(getProduct(req, res))
}

export const createOrSetCart = (req, res) => {
    const product = getProduct(req, res)
    const userId = req.userId;
    let userCart = carts.find(cart => cart.userId === userId);
    if (!userCart) {
        userCart = {
            id: crypto.randomUUID(),
            userId: userId,
            products: []
        }
        carts.push(userCart);
    }
    userCart.products.push(product);
    res.status(201).json(userCart);
}

export const deleteProduct = (req, res) => {
    const prodId = Number(req.params.id);
    const userId = req.userId;
    let userCart = carts.find(cart => cart.userId === userId);
    if (!userCart) {
        throw new ApiError(404, 'Cart not found')
    }
    const prodIndex = userCart.products.findIndex(product => product.id === prodId);
    if (prodIndex === -1) {
        throw new ApiError(404, 'Product not found in cart')
    }
    userCart.products.splice(prodIndex, 1);
    res.status(200).json(userCart);
}

export const getOrder = (req, res) => {
    const userId = req.userId;
    const userCart = carts.find(cart => cart.userId === userId);
    if (!userCart) {
        throw new ApiError(404, 'Cart not found')
    }
    const userOrder = {
        id: crypto.randomUUID(),
        userId: userId,
        products: userCart.products,
        totalPrice: userCart.products.reduce((acc, prod) => acc + prod.price, 0)
    }
    orders.push(userOrder);
    res.status(201).json(userOrder)
}


export const createNewProduct = async (req, res) => {
    const { name, description, category, price } = req.body;

    if(!name || !description || !category || !price ) {
        throw new ApiError(400, 'Missing required fields')
    }

    const product = { name, description, category, price }

    await addProductInStorage(product)
    res.status(200).json({
        message: 'Product added',
        data: product
    })
}

export const handleProductImport = async (req, res) =>  {
    if (!req.file) {
        throw new ApiError(400, 'File to upload is absent')
        return res.status(400).json({ error: 'Нет файла для загрузки' });
    }

    uploadEvents.emit('fileUploadStart');
    const products = [];
    const readableStream = new stream.PassThrough();
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
        .on('end', () => {
            fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
            uploadEvents.emit('fileUploadEnd');
            res.status(200).json({ message: 'File successfully uploaded and processed' });
        })
        .on('error', (error) => {
            uploadEvents.emit('fileUploadFailed');
            throw new ApiError(500, 'Failed to process file')
        });
}






