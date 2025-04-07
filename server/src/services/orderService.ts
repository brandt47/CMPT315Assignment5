import mongoose from 'mongoose';
import {
    createOrder as createOrderDao,
    findAllOrders as findAllOrdersDao,
    findOrderById as findOrderByIdDao,
    updateOrderStatus as updateOrderStatusDao,
    CreateOrderData
} from '../daos/orderDao';
import {
    findProductById as findProductByIdDao,
    updateProductStock
} from '../daos/productDao';
import { IOrder } from '../models/Order';
import { AppError } from '../utils/AppError';

// Interface for query options for fetching orders (used by getAllOrders)
interface OrderQueryOptions {
    sort?: string;
    order?: 'asc' | 'desc';
}

/**
 * Service layer function to handle placing a new order.
 * Includes validation, stock check, and transaction management.
 * @param orderData - Data for the new order (productId, quantity, emailId, deliveryDate).
 * @returns A promise that resolves to the newly created order document.
 * @throws Throws an AppError for validation, stock issues, or database errors.
 */
export const placeOrder = async (orderData: CreateOrderData): Promise<IOrder> => {
    const { productId, quantity, emailId, deliveryDate } = orderData;

    // --- Input Validation ---
    if (!productId || !quantity || !emailId || !deliveryDate) {
        throw new AppError('Missing required order fields (productId, quantity, emailId, deliveryDate)', 400);
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
         throw new AppError('Invalid Product ID format', 400);
    }
    if (quantity <= 0) {
        throw new AppError('Quantity must be greater than zero', 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId)) {
        throw new AppError('Invalid email format', 400);
    }
    if (isNaN(new Date(deliveryDate).getTime())) {
         throw new AppError('Invalid delivery date', 400);
    }
    if (new Date(deliveryDate) < new Date()) {
         throw new AppError('Delivery date cannot be in the past', 400);
    }

    // --- Transaction Logic ---
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Fetch Product & Check Stock (within transaction)
        const product = await findProductByIdDao(productId);
        if (!product) {
            throw new AppError(`Product with ID ${productId} not found`, 404);
        }
        if (product.stock < quantity) {
            throw new AppError(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${quantity}`, 409);
        }

        // Create Order (within transaction)
        const newOrder = await createOrderDao(orderData, session);

        // Decrement Product Stock (within transaction)
        const updatedProduct = await updateProductStock(productId, -quantity, session);
        if (!updatedProduct) {
            throw new AppError(`Failed to update stock for product ID ${productId}`, 500);
        }
        if (updatedProduct.stock < 0) {
             throw new AppError(`Stock update resulted in negative inventory for product ${productId}`, 500);
        }

        // Commit Transaction
        await session.commitTransaction();
        console.log(`Order ${newOrder._id} placed successfully, stock updated for product ${productId}.`);
        return newOrder;

    } catch (error) {
        // Abort Transaction on error
        console.error('Transaction error during placeOrder, aborting transaction:', error);
        await session.abortTransaction();
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to place order due to a server error during transaction', 500);

    } finally {
        // End the session
        await session.endSession();
    }
};

/**
 * Service layer function to retrieve all orders.
 * Handles query parameters for sorting.
 * @param options Object containing sorting parameters.
 * @returns A promise that resolves to an array of order documents with populated product info.
 * @throws Throws an error if the DAO layer fails.
 */
export const getAllOrders = async (options: OrderQueryOptions = {}): Promise<IOrder[]> => {
    try {
        console.log('Service getAllOrders received options:', options); // Debug log
        const orders = await findAllOrdersDao(options);
        return orders;
    } catch (error) {
        console.error('Error in order service while getting all orders:', error);
        throw new AppError('Failed to retrieve orders', 500);
    }
};

/**
 * Service layer function to handle canceling an existing order.
 * Includes validation, date check, and transaction management.
 * @param orderId - The ID of the order to cancel.
 * @returns A promise that resolves to the updated (canceled) order document.
 * @throws Throws an AppError for validation, business logic, or database errors.
 */
export const cancelOrder = async (orderId: string): Promise<IOrder> => {
    // --- Validation ---
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new AppError('Invalid Order ID format', 400);
    }

    // --- Transaction Logic ---
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Fetch Order (within transaction, requires population for product ID and delivery date)
        // Use the specific DAO function findOrderById which populates productId
        const order = await findOrderByIdDao(orderId, session);
        if (!order) {
            throw new AppError(`Order with ID ${orderId} not found`, 404);
        }

        // Check if already canceled
        if (order.status === 'Canceled') {
            throw new AppError(`Order ${orderId} is already canceled`, 409); // Conflict
        }

        // 2. Check Delivery Date Condition
        const now = new Date();
        const deliveryDate = new Date(order.deliveryDate);
        const diffTime = deliveryDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Difference in days

        const CANCELLATION_WINDOW_DAYS = 5;
        if (diffDays <= CANCELLATION_WINDOW_DAYS) {
            throw new AppError(`Order cannot be canceled. Delivery date must be more than ${CANCELLATION_WINDOW_DAYS} days away. Current difference: ${diffDays} days.`, 403); // Forbidden
        }

        // Ensure productId is populated and valid before restoring stock
        if (!order.productId || typeof order.productId !== 'object' || !('stock' in order.productId)) {
            // This check is crucial because productId is populated.
            // It should be an object (the populated product document) by now.
            console.error('CancelOrder Error: Product details not populated correctly for order:', orderId);
            throw new AppError('Failed to retrieve product details for stock restoration.', 500);
        }
        const productToRestore = order.productId; // Product is populated
        const quantityToRestore = order.quantity;

        // 3. Update Order Status to 'Canceled' (within transaction)
        const canceledOrder = await updateOrderStatusDao(orderId, 'Canceled', session);
        if (!canceledOrder) {
             throw new AppError(`Failed to update status for order ID ${orderId}`, 500);
        }

        // 4. Restore Product Stock (within transaction)
        const restoredProduct = await updateProductStock(productToRestore._id, quantityToRestore, session);
        if (!restoredProduct) {
             throw new AppError(`Failed to restore stock for product ID ${productToRestore._id}`, 500);
        }

        // 5. Commit Transaction
        await session.commitTransaction();
        console.log(`Order ${orderId} canceled successfully, stock restored for product ${productToRestore._id}.`);
        // Return the canceled order (refetch or use the updated one)
        // Refetching ensures we get the final state potentially with population if needed elsewhere
        const finalCanceledOrder = await findOrderByIdDao(orderId); // Fetch outside session
        if (!finalCanceledOrder) throw new AppError('Failed to refetch canceled order', 500); // Should not happen
        return finalCanceledOrder;

    } catch (error) {
        // Abort Transaction on error
        console.error(`Transaction error during cancelOrder for ID ${orderId}, aborting transaction:`, error);
        await session.abortTransaction();
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to cancel order due to a server error during transaction', 500);

    } finally {
        // End the session
        await session.endSession();
    }
}; 