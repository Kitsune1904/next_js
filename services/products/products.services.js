import {ApiError} from "../../middleware/ErrorApi.js";
import fs from "fs/promises";
import {PRODUCTS_FILE} from "../../constants.js";
import crypto from "crypto";
import {products} from "../../repository/storage.js";

/**
 * Creates new product
 * @param body
 * @return {{name, description, category, price}}
 */
export const createNewProduct = (body) => {
    const { name, description, category, price } = body;

    if(!name || !description || !category || !price ) {
        throw new ApiError(400, 'Missing required fields')
    }
    return {name, description, category, price}
}


export const getProductsStorage =  async () => {
    try {
        const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return [];
        } else if (err instanceof SyntaxError) {
            throw new ApiError(500, 'Error parsing JSON');
        } else {
            throw new ApiError(500, 'Error reading file');
        }
    }
};

export const addProductInStorage = async (body) => {
    const product = createNewProduct(body)
    const productsStore = await getProductsStorage();

    if (productsStore.length > 0) {
        const isProdExist = productsStore.findIndex(prod => prod.name === product.name);
        if (isProdExist !== -1) {
            throw new ApiError(409, 'Product exist')
        }
    }

    productsStore.push({
        id: crypto.randomUUID(),
        ...product
    });

    try {
        await fs.writeFile(PRODUCTS_FILE, JSON.stringify(productsStore, null, 2), 'utf8')
    } catch (err) {
        throw new ApiError(500, 'Error adding data');
    }
    return product
}

export const getProduct = (req, _) => {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
        throw new ApiError(400, 'Wrong id format')
    }
    const product = products.find(prod => prod.id === productId);
    if (!product) {
        throw new ApiError(404, 'Product not found')
    }
    return product
}
