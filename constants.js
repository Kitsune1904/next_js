"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCTS_FILE = exports.LOG_FILE = exports.PORT = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const envFile = process.env.NODE_ENV === 'production' ? './env/.env.production' : './env/.env.development';
dotenv_1.default.config({ path: envFile });
exports.PORT = Number(process.env.PORT) || 5000;
exports.LOG_FILE = process.env.LOG_FILE || './logs/productsUpload.dev.log';
exports.PRODUCTS_FILE = path_1.default.join('repository', 'products.store.json');
