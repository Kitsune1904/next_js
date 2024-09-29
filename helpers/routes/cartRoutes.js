import { Router } from 'express';
import {checkUserId} from "../helpers.js";
import {createOrSetCart, deleteProd, getOrder} from "../../shop/services.js";

const cartRouter = Router();

cartRouter.put('/:id', checkUserId, createOrSetCart);

cartRouter.delete('/:id', checkUserId, deleteProd)

cartRouter.post('/checkout', checkUserId, getOrder)

export default cartRouter