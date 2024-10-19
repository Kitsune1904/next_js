import { Router } from 'express';
import {addProduct, deleteProduct, getOrder} from "../controllers/cart.controllers";
import {checkUserId} from "../middleware/checkId";

const cartRouter: Router = Router();

cartRouter.use(checkUserId)

cartRouter.put('/:id', addProduct);

cartRouter.delete('/:id', deleteProduct)

cartRouter.post('/checkout', getOrder)

export default cartRouter