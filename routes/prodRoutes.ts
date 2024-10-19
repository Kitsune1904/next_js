import { Router } from 'express';
import multer, {Multer, StorageEngine} from "multer";
import {
    addProduct,
    getAllProducts,
    getProductById,
    handleProductsFileImport
} from "../controllers/products.controllers";
import {checkUserId} from "../middleware/checkId";
import {adminOnly} from "../middleware/checkRole";

const storage: StorageEngine = multer.memoryStorage();
const upload: Multer = multer({ storage });

const prodRouter: Router = Router();

prodRouter.use(checkUserId)

prodRouter.get('/', getAllProducts);

prodRouter.get('/:id', getProductById)

prodRouter.post('/product', adminOnly,  addProduct)

prodRouter.post('/import', upload.single('file'), handleProductsFileImport);


export default prodRouter