"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeOrder = exports.deleteProductFromCart = exports.createOrCompleteCart = void 0;
const storage_1 = require("../../repository/storage");
const crypto_1 = __importDefault(require("crypto"));
const ErrorApi_1 = require("../../middleware/ErrorApi");
/**
 * Adds product in new or existed user's cart
 * @param product
 * @param userId
 * @return ICart
 */
const createOrCompleteCart = (product, userId) => {
    let userCart = storage_1.carts.find((cart) => cart.userId === userId);
    if (!userCart) {
        userCart = {
            id: crypto_1.default.randomUUID(),
            userId: userId,
            products: []
        };
        storage_1.carts.push(userCart);
    }
    userCart.products.push(product);
    return userCart;
};
exports.createOrCompleteCart = createOrCompleteCart;
/**
 * Delete product from user's cart
 * @param prodId
 * @param userId
 * @return ICart
 */
const deleteProductFromCart = (prodId, userId) => {
    let userCart = storage_1.carts.find(cart => cart.userId === userId);
    if (!userCart) {
        throw new ErrorApi_1.ApiError(404, 'Cart not found');
    }
    const prodIndex = userCart.products.findIndex((product) => product.id === prodId);
    if (prodIndex === -1) {
        throw new ErrorApi_1.ApiError(404, 'Product not found in cart');
    }
    userCart.products.splice(prodIndex, 1);
    return userCart;
};
exports.deleteProductFromCart = deleteProductFromCart;
/**
 * By user ID take its cart and create an order
 * @param userId
 * @return IOrder
 */
const completeOrder = (userId) => {
    const userCart = storage_1.carts.find((cart) => cart.userId === userId);
    if (!userCart) {
        throw new ErrorApi_1.ApiError(404, 'Cart not found');
    }
    const userOrder = {
        id: crypto_1.default.randomUUID(),
        userId: userId,
        products: userCart.products,
        totalPrice: userCart.products.reduce((acc, prod) => acc + prod.price, 0)
    };
    storage_1.orders.push(userOrder);
    return userOrder;
};
exports.completeOrder = completeOrder;
