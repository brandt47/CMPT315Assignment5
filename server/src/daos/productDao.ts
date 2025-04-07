import Product, { IProduct } from '../models/Product';
import mongoose, { FilterQuery, SortOrder, ClientSession } from 'mongoose';

// Interface for query options (filtering and sorting)
interface ProductQueryOptions {
    category?: string;
    price_gte?: number;
    price_lte?: number;
    sort?: string; // Field to sort by (name, price, stock)
    order?: 'asc' | 'desc'; // Sort order
}

/**
 * Finds products based on filtering and sorting options.
 * @param options - Object containing filter and sort parameters.
 * @returns A promise that resolves to an array of product documents.
 * @throws Throws an error if the database query fails.
 */
export const findAllProducts = async (options: ProductQueryOptions = {}): Promise<IProduct[]> => {
    try {
        const filter: FilterQuery<IProduct> = {};
        const sort: { [key: string]: SortOrder } = {};

        // Build filter query
        if (options.category) {
            filter.category = options.category;
        }
        if (options.price_gte || options.price_lte) {
            filter.price = {};
            if (options.price_gte) {
                filter.price.$gte = options.price_gte;
            }
            if (options.price_lte) {
                filter.price.$lte = options.price_lte;
            }
        }

        // Build sort query
        if (options.sort && ['name', 'price', 'stock'].includes(options.sort)) {
            const sortOrder: SortOrder = options.order === 'desc' ? -1 : 1;
            sort[options.sort] = sortOrder;
        } else {
            // Default sort if none provided (e.g., by name ascending)
            sort.name = 1;
        }

        console.log('DAO Query - Filter:', filter, 'Sort:', sort); // Debug log

        const products = await Product.find(filter).sort(sort);
        return products;
    } catch (error) {
        console.error('Error fetching filtered/sorted products from DAO:', error);
        throw new Error('Database query failed while fetching products.');
    }
};

/**
 * Finds a single product by its ID.
 * @param productId The ID of the product to find.
 * @returns A promise that resolves to the product document or null if not found.
 * @throws Throws an error if the database query fails.
 */
export const findProductById = async (productId: string | mongoose.Types.ObjectId): Promise<IProduct | null> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            console.warn('DAO: Invalid product ID format:', productId);
            return null; // Or throw a specific validation error
        }
        const product = await Product.findById(productId);
        return product;
    } catch (error) {
        console.error(`Error fetching product with ID ${productId} from DAO:`, error);
        throw new Error(`Database query failed while fetching product ID ${productId}.`);
    }
};

/**
 * Updates the stock quantity of a product.
 * Can be used to decrement stock when an order is placed or increment when cancelled.
 * @param productId The ID of the product to update.
 * @param quantityChange The amount to change the stock by (negative to decrease, positive to increase).
 * @param session Optional Mongoose client session for transactions.
 * @returns A promise that resolves to the updated product document or null if not found.
 * @throws Throws an error if the database update fails.
 */
export const updateProductStock = async (
    productId: string | mongoose.Types.ObjectId,
    quantityChange: number,
    session?: ClientSession
): Promise<IProduct | null> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            console.warn('DAO: Invalid product ID format for stock update:', productId);
            return null;
        }

        // Find and update the product stock atomically
        // The { new: true } option returns the document after the update
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $inc: { stock: quantityChange } }, // Use $inc to increment/decrement stock
            { new: true, session } // Return the updated document and use session if provided
        );

        if (updatedProduct && updatedProduct.stock < 0) {
             // This shouldn't happen if stock check is done correctly before calling, but as a safeguard
             console.error(`DAO: Stock for product ${productId} went negative after update!`);
             // Optionally revert the change or throw a specific error
             // For now, just log and let the transaction handle rollback if applicable
        }

        return updatedProduct;
    } catch (error) {
        console.error(`Error updating stock for product ID ${productId} in DAO:`, error);
        throw new Error(`Database query failed while updating stock for product ID ${productId}.`);
    }
};

// TODO: Add updateStock function needed for order processing

// Add other DAO functions here later (findById, filtering, sorting, updateStock etc.) 