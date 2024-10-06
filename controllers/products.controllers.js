"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleProductsFileImport = exports.addProduct = exports.getProductById = exports.getAllProducts = void 0;
const storage_1 = require("../repository/storage");
const ErrorApi_1 = require("../middleware/ErrorApi");
const eventEmmiter_1 = require("../middleware/eventEmmiter");
const stream_1 = __importDefault(require("stream"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const crypto_1 = __importDefault(require("crypto"));
const promises_1 = __importDefault(require("fs/promises"));
const constants_1 = require("../constants");
const products_services_1 = require("../services/products/products.services");
/**
 * Receives a request to show all products from storage.
 * Response in json format by array of product objects from storage.
 * @param req
 * @param res
 */
const getAllProducts = (req, res) => {
    res.status(200).json(storage_1.products);
};
exports.getAllProducts = getAllProducts;
/**
 * Receives a request to show product from storage y it's ID.
 * Response in json format by product object from storage using product ID
 * @param req
 * @param res
 */
const getProductById = (req, res) => {
    res.status(200).json((0, products_services_1.getProduct)(req));
};
exports.getProductById = getProductById;
/**
 * Receives a request to add a new product in products.storage.json
 * Response by new added product
 * @param req
 * @param res
 * @return {Promise<void>}
 */
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield (0, products_services_1.addProductInStorage)(req.body);
    res.status(200).json({
        message: 'Product added',
        data: product
    });
});
exports.addProduct = addProduct;
/**
 * Receives a request to reed info from downloaded file in csv format, if file isn't missed
 * it will read it from memory and create products.storage.json file with parsed info from
 * downloaded file
 * @param req
 * @param res
 * @return {Promise<void>}
 */
const handleProductsFileImport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new ErrorApi_1.ApiError(400, 'File to upload is absent');
    }
    eventEmmiter_1.uploadEvents.emit('fileUploadStart');
    const products = [];
    const readableStream = new stream_1.default.PassThrough();
    readableStream.end(req.file.buffer);
    readableStream
        .pipe((0, csv_parser_1.default)())
        .on('data', (data) => products.push({
        id: crypto_1.default.randomUUID(),
        name: data.name,
        description: data.description,
        category: data.category,
        price: parseFloat(data.price)
    }))
        .on('end', () => {
        promises_1.default.writeFile(constants_1.PRODUCTS_FILE, JSON.stringify(products, null, 2));
        eventEmmiter_1.uploadEvents.emit('fileUploadEnd');
        res.status(200).json({ message: 'File successfully uploaded and processed' });
    })
        .on('error', () => {
        eventEmmiter_1.uploadEvents.emit('fileUploadFailed');
        throw new ErrorApi_1.ApiError(500, 'Failed to process file');
    });
});
exports.handleProductsFileImport = handleProductsFileImport;
