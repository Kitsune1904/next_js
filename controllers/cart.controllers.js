"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrder = exports.deleteProduct = exports.addProduct = void 0;
const cart_services_1 = require("../services/cart/cart.services");
const products_services_1 = require("../services/products/products.services");
/**
 * Receives a request to add a new product in cart
 * Response by updated cart with new added product
 * @param req
 * @param res
 */
const addProduct = (req, res) => {
    const product = (0, products_services_1.getProduct)(req);
    const userId = Number(req.userId);
    const cart = (0, cart_services_1.createOrCompleteCart)(product, userId);
    res.status(201).json(cart);
};
exports.addProduct = addProduct;
/**
 * Receives a request to delete product from cart by its ID
 * Response by updated cart without deleted product
 * @param req
 * @param res
 */
const deleteProduct = (req, res) => {
    const prodId = Number(req.params.id);
    const userId = Number(req.userId);
    const cart = (0, cart_services_1.deleteProductFromCart)(prodId, userId);
    res.status(200).json(cart);
};
exports.deleteProduct = deleteProduct;
/**
 * Receives a request to show user order info by user ID
 * Response by user order info
 * @param req
 * @param res
 */
const getOrder = (req, res) => {
    const userId = Number(req.userId);
    const order = (0, cart_services_1.completeOrder)(userId);
    res.status(201).json(order);
};
exports.getOrder = getOrder;
