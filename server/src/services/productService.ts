import {
    findAllProducts as findAllProductsDao,
    findProductById as findProductByIdDao
} from '../daos/productDao';
import { IProduct } from '../models/Product';
import mongoose from 'mongoose';

// Interface mirroring DAO options, potentially adding service-specific validation/logic later
interface ProductQueryOptions {
    category?: string;
    price_gte?: number;
    price_lte?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

/**
 * Service layer function to retrieve products based on query options.
 * Calls the DAO function to fetch products.
 * @param options Object containing filtering and sorting parameters.
 * @returns A promise that resolves to an array of product documents.
 * @throws Throws an error if the DAO layer fails.
 */
export const getAllProducts = async (options: ProductQueryOptions): Promise<IProduct[]> => {
    try {
        // TODO: Add any service-level validation or transformation for options if needed
        console.log('Service received options:', options); // Debug log
        const products = await findAllProductsDao(options);
        return products;
    } catch (error) {
        console.error('Error in product service while getting products:', error);
        throw error; // Re-throw
    }
};

/**
 * Service layer function to retrieve a single product by its ID.
 * Calls the DAO function to fetch the product.
 * @param productId The ID of the product.
 * @returns A promise that resolves to the product document or null if not found.
 * @throws Throws an error if the DAO layer fails or ID is invalid (can add specific checks here).
 */
export const getProductById = async (productId: string | mongoose.Types.ObjectId): Promise<IProduct | null> => {
    try {
        // Optional: Add service-level validation for productId format if not handled in DAO
        const product = await findProductByIdDao(productId);
        return product;
    } catch (error) {
        console.error(`Error in product service while getting product ID ${productId}:`, error);
        throw error; // Re-throw
    }
};

// Add other service functions later 