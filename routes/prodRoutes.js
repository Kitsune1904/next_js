"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const products_controllers_1 = require("../controllers/products.controllers");
const checkId_1 = require("../middleware/checkId");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const prodRouter = (0, express_1.Router)();
prodRouter.use(checkId_1.checkUserId);
prodRouter.get('/', products_controllers_1.getAllProducts);
prodRouter.get('/:id', products_controllers_1.getProductById);
prodRouter.post('/product', products_controllers_1.addProduct);
prodRouter.post('/import', upload.single('file'), products_controllers_1.handleProductsFileImport);
exports.default = prodRouter;
