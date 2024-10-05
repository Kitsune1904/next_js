import { Router } from 'express';
import {addProduct, deleteProduct, getOrder} from "../controllers/cart.controllers.js";
import {checkUserId} from "../middleware/checkId.js";

const cartRouter = Router();

cartRouter.use(checkUserId)

cartRouter.put('/:id', addProduct);

cartRouter.delete('/:id', deleteProduct)

cartRouter.post('/checkout', getOrder)

export default cartRouter