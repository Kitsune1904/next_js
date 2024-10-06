"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOG_FILE = exports.PRODUCTS_FILE = exports.PORT = void 0;
const path_1 = __importDefault(require("path"));
exports.PORT = 5000;
exports.PRODUCTS_FILE = path_1.default.join('repository', 'products.store.json');
exports.LOG_FILE = path_1.default.join('logs', 'productsUpload.log');
