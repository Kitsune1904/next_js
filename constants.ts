import path from "path";
import dotenv from 'dotenv'

const envFile: string = process.env.NODE_ENV === 'production' ? './env/.env.production' : './env/.env.development';
dotenv.config({ path: envFile });

export const PORT: number = Number(process.env.PORT) || 5000;
export const LOG_FILE: string = process.env.LOG_FILE || './logs/productsUpload.dev.log';

export const PRODUCTS_FILE: string = path.join('repository', 'products.store.json');

export const JWT_KEY: string = process.env.JWT_KEY || 'secret'


export const ADMIN_NAME: string = process.env.ADMIN_NAME || 'secret';
export const ADMIN_EMAIL: string = process.env.ADMIN_EMAIL || 'secret';
export const ADMIN_PASSWORD: string = process.env.ADMIN_PASSWORD || 'secret';