import {carts, orders} from "../../repository/storage.js";
import crypto from "crypto";
import {ApiError} from "../../middleware/ErrorApi.js";

/**
 * Adds product in new or existed user's cart
 * @param product
 * @param userId
 * @return Cart
 */
export const createOrCompleteCart = (product, userId) => {
    let userCart = carts.find(cart => cart.userId === userId);
    if (!userCart) {
        userCart = {
            id: crypto.randomUUID(),
            userId: userId,
            products: []
        }
        carts.push(userCart);
    }
    userCart.products.push(product);
    return userCart
}

/**
 * Delete product from user's cart
 * @param prodId
 * @param userId
 * @return Cart
 */
export const deleteProductFromCart = (prodId, userId) => {
    let userCart = carts.find(cart => cart.userId === userId);
    if (!userCart) {
        throw new ApiError(404, 'Cart not found')
    }
    const prodIndex = userCart.products.findIndex(product => product.id === prodId);
    if (prodIndex === -1) {
        throw new ApiError(404, 'Product not found in cart')
    }
    userCart.products.splice(prodIndex, 1);
    return userCart
}

/**
 * By user ID take its cart and create an order
 * @param userId
 * @return Order
 */
export const completeOrder = (userId) => {
    const userCart = carts.find(cart => cart.userId === userId);
    if (!userCart) {
        throw new ApiError(404, 'Cart not found')
    }
    const userOrder = {
        id: crypto.randomUUID(),
        userId: userId,
        products: userCart.products,
        totalPrice: userCart.products.reduce((acc, prod) => acc + prod.price, 0)
    }
    orders.push(userOrder);
    return userOrder
}