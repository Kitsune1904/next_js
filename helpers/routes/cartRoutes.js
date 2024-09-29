import { Router } from 'express';
import {checkUserId} from "../helpers.js";
import {createOrSetCart, deleteProduct, getOrder} from "../../shop/services.js";

const cartRouter = Router();

cartRouter.put('/:id', checkUserId, createOrSetCart);

cartRouter.delete('/:id', checkUserId, deleteProduct)

cartRouter.post('/checkout', checkUserId, getOrder)

export default cartRouter