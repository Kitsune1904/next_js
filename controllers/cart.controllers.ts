import {completeOrder, createOrCompleteCart, deleteProductFromCart} from "../services/cart/cart.services";
import {getProduct} from "../services/products/products.services";
import { Request, Response } from 'express';
import {ICart, IOrder, TProduct} from "../models/models";

/**
 * Receives a request to add a new product in cart
 * Response by updated cart with new added product
 * @param req
 * @param res
 */
export const addProduct = (req: Request, res: Response): void => {
    const product: TProduct = getProduct(req)
    const userId: number = Number(req.userId);
    const cart: ICart = createOrCompleteCart(product, userId)
    res.status(201).json(cart);
}
/**
 * Receives a request to delete product from cart by its ID
 * Response by updated cart without deleted product
 * @param req
 * @param res
 */
export const deleteProduct = (req: Request, res: Response): void => {
    const prodId: number = Number(req.params.id);
    const userId: number = Number(req.userId);
    const cart: ICart = deleteProductFromCart(prodId, userId)
    res.status(200).json(cart);
}

/**
 * Receives a request to show user order info by user ID
 * Response by user order info
 * @param req
 * @param res
 */
export const getOrder = (req: Request, res: Response): void => {
    const userId: number = Number(req.userId);
    const order: IOrder = completeOrder(userId)
    res.status(201).json(order)
}