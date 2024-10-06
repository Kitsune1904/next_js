import {carts, orders} from "../../repository/storage";
import crypto from "crypto";
import {ApiError} from "../../middleware/ErrorApi";
import {ICart, IOrder, TProduct} from "../../types_and_interfaces/types_and_interfaces";

/**
 * Adds product in new or existed user's cart
 * @param product
 * @param userId
 * @return ICart
 */
export const createOrCompleteCart = (product: TProduct, userId: number): ICart=> {
    let userCart: ICart | undefined = carts.find((cart: ICart): boolean  => cart.userId === userId);
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
 * @return ICart
 */
export const deleteProductFromCart = (prodId: number, userId: number): ICart => {
    let userCart: ICart | undefined  = carts.find(cart => cart.userId === userId);
    if (!userCart) {
        throw new ApiError(404, 'Cart not found')
    }
    const prodIndex: number = userCart.products.findIndex((product: TProduct) : boolean => product.id === prodId);
    if (prodIndex === -1) {
        throw new ApiError(404, 'Product not found in cart')
    }
    userCart.products.splice(prodIndex, 1);
    return userCart
}

/**
 * By user ID take its cart and create an order
 * @param userId
 * @return IOrder
 */
export const completeOrder = (userId: number): IOrder => {
    const userCart: ICart | undefined  = carts.find((cart: ICart): boolean => cart.userId === userId);
    if (!userCart) {
        throw new ApiError(404, 'Cart not found')
    }
    const userOrder: IOrder  = {
        id: crypto.randomUUID(),
        userId: userId,
        products: userCart.products,
        totalPrice: userCart.products.reduce((acc: number, prod: TProduct): number => acc + prod.price, 0)
    }
    orders.push(userOrder);
    return userOrder
}