import { Router } from 'express';
import {checkUserId} from "../helpers.js";
import {createNewProduct, getAllProducts, getProdById, handleProductImport} from "../../shop/services.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const prodRouter = Router();

prodRouter.get('/', checkUserId, getAllProducts);

prodRouter.get('/:id', checkUserId, getProdById)

prodRouter.post('/product', checkUserId, createNewProduct)

prodRouter.post('/import', upload.single('file'), handleProductImport);


export default prodRouter