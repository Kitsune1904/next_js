import path from "path";
import dotenv from 'dotenv'

const envFile: string = process.env.NODE_ENV === 'production' ? './env/.env.production' : './env/.env.development';
dotenv.config({ path: envFile });

export const PORT: number = Number(process.env.PORT) || 5000;
export const LOG_FILE: string = process.env.LOG_FILE || './logs/productsUpload.dev.log';


export const PRODUCTS_FILE: string = path.join('repository', 'products.store.json');
