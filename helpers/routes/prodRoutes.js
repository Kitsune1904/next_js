import { Router } from 'express';
import {checkUserId} from "../helpers.js";
import {createNewProduct, getAllProducts, getProdById, handleProductImport} from "../../shop/services.js";
import multer from "multer";

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});//Configure the place you will upload your file

let upload = multer({ storage: storage });

const prodRouter = Router();

prodRouter.get('/', checkUserId, getAllProducts);

prodRouter.get('/:id', checkUserId, getProdById)

prodRouter.post('/product', checkUserId, createNewProduct)

prodRouter.post('/import', upload.single('file'), handleProductImport);


export default prodRouter