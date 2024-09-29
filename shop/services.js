import {addProductInStorage, getDate, getProduct, getProductStorage} from "../helpers/helpers.js";
import {carts, orders, products, users} from "../storages/storage.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import {ApiError} from "../helpers/ErrorApi.js";
import { userValidationSchema} from "../helpers/validation.js";
import { EventEmitter } from 'events';
import fs, { unlink } from 'fs/promises';
import * as path from "path";
import {createReadStream} from "fs";
import csv from "csv-parser";

const PRODUCTS_FILE = path.join('storages', 'products.store.json');


const uploadEvents = new EventEmitter();
uploadEvents.on('fileUploadStart', (message) => console.log(message));
uploadEvents.on('fileUploadEnd', (message) => console.log(message));
uploadEvents.on('fileUploadFailed', (error) => console.error(error));

export const registrationUser = async (req, res) => {
    const newUser = req.body

    await userValidationSchema.validateAsync(newUser).catch(error => {
        throw new ApiError(!newUser.name || !newUser.email || !newUser.password ? 402 : 400, error.details[0].message);
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

export const deleteProd = (req, res) => {
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
    const filePath = 'storages/products.csv';

    uploadEvents.emit('fileUploadStart', getDate() + ' - File upload has started');

    try {
        const products = await parseCSVFile(filePath);
        await saveProducts(products);
        await unlink(filePath);

        uploadEvents.emit('fileUploadEnd', getDate() + ' - File has been uploaded');
        res.status(200).json({ message: 'File successfully uploaded and processed' });
    } catch (error) {
        uploadEvents.emit('fileUploadFailed', getDate() + ' - Error occurred, file upload was failed: ' + error.message);
        await unlink(filePath);
        throw new ApiError(500, 'Failed to process file')
    }
}


const ensureProductsFileExists = async() => {
    try {
        await fs.access(PRODUCTS_FILE);
    } catch {
        await fs.writeFile(PRODUCTS_FILE, JSON.stringify([]));
    }
}

export const parseCSVFile = async(filePath) =>  {
    const products = [];

    return new Promise((resolve, reject) => {
        createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                const product = {
                    name: row.name,
                    description: row.description,
                    category: row.category,
                    price: parseFloat(row.price),
                };
                products.push(product);
            })
            .on('end', () => resolve(products))
            .on('error', (error) => reject(error));
    });
}

export const saveProducts = async(newProducts) => {
    await ensureProductsFileExists();

    try {
        const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
        const existingProducts = JSON.parse(data);

        const updatedProducts = [...existingProducts, ...newProducts];
        await fs.writeFile(PRODUCTS_FILE, JSON.stringify(updatedProducts, null, 2));
    } catch (error) {
        throw new Error('Failed to save products: ' + error.message);
    }
}