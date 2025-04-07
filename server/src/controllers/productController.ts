import { Request, Response } from 'express';
import * as productService from '../services/productService';
import mongoose from 'mongoose';

/**
 * Controller function to handle GET requests for fetching products.
 * Parses query parameters for filtering and sorting.
 * Calls the product service to get products and sends the response.
 * @param req Express Request object (query params: category, price_gte, price_lte, sort, order)
 * @param res Express Response object
 */
const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extract and type query parameters
        const { category, price_gte, price_lte, sort, order } = req.query;

        const options = {
            category: category as string | undefined,
            price_gte: price_gte ? parseFloat(price_gte as string) : undefined,
            price_lte: price_lte ? parseFloat(price_lte as string) : undefined,
            sort: sort as string | undefined,
            order: order as 'asc' | 'desc' | undefined,
        };

        // Remove undefined values to avoid passing them to the service/DAO
        Object.keys(options).forEach(key => options[key as keyof typeof options] === undefined && delete options[key as keyof typeof options]);

        console.log('Controller received query params:', req.query);
        console.log('Controller parsed options:', options);

        const products = await productService.getAllProducts(options);
        res.status(200).json(products);
    } catch (error: any) {
        console.error('Error in product controller getProducts:', error);
        // Basic error handling, consider more specific checks (e.g., validation errors)
        if (error instanceof Error && error.message.includes('validation')) { // Example specific error
             res.status(400).json({ message: `Invalid query parameter: ${error.message}` });
        } else {
             res.status(500).json({ message: error.message || 'Failed to fetch products' });
        }
    }
};

/**
 * Controller function to handle GET requests for fetching a single product by ID.
 * @param req Express Request object (params: id)
 * @param res Express Response object
 */
const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const productId = req.params.id;
        if (!productId) {
            res.status(400).json({ message: 'Product ID is required' });
            return;
        }

        // Optional: Validate ID format here if needed before calling service
        if (!mongoose.Types.ObjectId.isValid(productId)) {
             res.status(400).json({ message: 'Invalid Product ID format' });
             return;
        }

        const product = await productService.getProductById(productId);

        if (!product) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.status(200).json(product);
        }
    } catch (error: any) {
        console.error(`Error in product controller getProductById for ID ${req.params.id}:`, error);
         res.status(500).json({ message: error.message || 'Failed to fetch product' });
    }
};

// Export controller functions
export default {
    getProducts,
    getProductById,
    // Add other controller functions here later
}; 