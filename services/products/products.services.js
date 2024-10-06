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
exports.getProduct = exports.addProductInStorage = exports.getProductsStorage = exports.createNewProduct = void 0;
const ErrorApi_1 = require("../../middleware/ErrorApi");
const promises_1 = __importDefault(require("fs/promises"));
const constants_1 = require("../../constants");
const crypto_1 = __importDefault(require("crypto"));
const storage_1 = require("../../repository/storage");
/**
 * Creates new product
 * @param body
 * @return TProductCSV
 */
const createNewProduct = (body) => {
    const { name, description, category, price } = body;
    if (!name || !description || !category || !price) {
        throw new ErrorApi_1.ApiError(400, 'Missing required fields');
    }
    return { name, description, category, price };
};
exports.createNewProduct = createNewProduct;
const getProductsStorage = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield promises_1.default.readFile(constants_1.PRODUCTS_FILE, 'utf-8');
        return JSON.parse(data);
    }
    catch (err) {
        return [];
    }
});
exports.getProductsStorage = getProductsStorage;
const addProductInStorage = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const product = (0, exports.createNewProduct)(body);
    const productsStore = yield (0, exports.getProductsStorage)();
    if (productsStore.length > 0) {
        const isProdExist = productsStore.findIndex((prod) => prod.name === product.name);
        if (isProdExist !== -1) {
            throw new ErrorApi_1.ApiError(409, 'Product exist');
        }
    }
    productsStore.push(Object.assign({ id: crypto_1.default.randomUUID() }, product));
    try {
        yield promises_1.default.writeFile(constants_1.PRODUCTS_FILE, JSON.stringify(productsStore, null, 2), 'utf8');
    }
    catch (err) {
        throw new ErrorApi_1.ApiError(500, 'Error adding data');
    }
    return product;
});
exports.addProductInStorage = addProductInStorage;
const getProduct = (req) => {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
        throw new ErrorApi_1.ApiError(400, 'Wrong id format');
    }
    const product = storage_1.products.find(prod => prod.id === productId);
    if (!product) {
        throw new ErrorApi_1.ApiError(404, 'Product not found');
    }
    return product;
};
exports.getProduct = getProduct;
