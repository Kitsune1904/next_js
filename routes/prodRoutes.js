import { Router } from 'express';
import multer from "multer";
import {
    addProduct,
    getAllProducts,
    getProductById,
    handleProductsFileImport
} from "../controllers/products.controllers.js";
import {checkUserId} from "../middleware/checkId.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const prodRouter = Router();

prodRouter.use(checkUserId)

prodRouter.get('/', getAllProducts);

prodRouter.get('/:id', getProductById)

prodRouter.post('/product', addProduct)

prodRouter.post('/import', upload.single('file'), handleProductsFileImport);


export default prodRouter