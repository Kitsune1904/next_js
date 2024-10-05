import {completeOrder, createOrCompleteCart, deleteProductFromCart} from "../services/cart/cart.services.js";
import {getProduct} from "../services/products/products.services.js";

/**
 * Receives a request to add a new product in cart
 * Response by updated cart with new added product
 * @param req
 * @param res
 */
export const addProduct = (req, res) => {
    const product = getProduct(req, res)
    const userId = req.userId;
    const cart = createOrCompleteCart(product, userId)
    res.status(201).json(cart);
}
/**
 * Receives a request to delete product from cart by its ID
 * Response by updated cart without deleted product
 * @param req
 * @param res
 */
export const deleteProduct = (req, res) => {
    const prodId = Number(req.params.id);
    const userId = req.userId;
    const cart = deleteProductFromCart(prodId, userId)
    res.status(200).json(cart);
}

/**
 * Receives a request to show user order info by user ID
 * Response by user order info
 * @param req
 * @param res
 */
export const getOrder = (req, res) => {
    const userId = req.userId;
    const order = completeOrder(userId)
    res.status(201).json(order)
}