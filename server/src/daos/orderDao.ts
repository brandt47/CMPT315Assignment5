import mongoose, { ClientSession, SortOrder } from 'mongoose';
import Order, { IOrder } from '../models/Order';

// Interface for the data needed to create an order
// Excludes fields generated by Mongoose or defaults (like _id, orderDate, status)
export type CreateOrderData = Pick<IOrder, 'productId' | 'quantity' | 'emailId' | 'deliveryDate'>;

// Interface for query options for fetching orders
interface OrderQueryOptions {
    sort?: string; // Field to sort by (e.g., 'orderDate', 'emailId', 'deliveryDate')
    order?: 'asc' | 'desc'; // Sort order
    // Add filtering options if needed later
}

/**
 * Creates a new order document in the database.
 * @param orderData - The data for the new order.
 * @param session - Optional Mongoose client session for transactions.
 * @returns A promise that resolves to the newly created order document.
 * @throws Throws an error if the database operation fails.
 */
export const createOrder = async (orderData: CreateOrderData, session?: ClientSession): Promise<IOrder> => {
    try {
        // Create a new Order instance with the provided data
        // Mongoose defaults will handle orderDate and status ('Confirmed')
        const newOrder = new Order(orderData);

        // Save the order, potentially within a transaction session
        const savedOrder = await newOrder.save({ session });
        return savedOrder;
    } catch (error) {
        console.error('Error creating order in DAO:', error);
        throw new Error('Database error occurred while creating the order.');
    }
};

/**
 * Finds all orders, optionally sorting them, and populates product details.
 * @param options - Object containing sorting parameters.
 * @returns A promise that resolves to an array of order documents with populated product info.
 * @throws Throws an error if the database query fails.
 */
export const findAllOrders = async (options: OrderQueryOptions = {}): Promise<IOrder[]> => {
    try {
        const sort: { [key: string]: SortOrder } = {};

        // Build sort query (allow sorting by common fields)
        // Add more sortable fields as needed (e.g., product name via population requires different handling)
        const validSortFields = ['orderDate', 'emailId', 'deliveryDate', 'status', 'quantity'];
        if (options.sort && validSortFields.includes(options.sort)) {
            const sortOrder: SortOrder = options.order === 'desc' ? -1 : 1;
            sort[options.sort] = sortOrder;
        } else {
            // Default sort (e.g., by most recent orderDate)
            sort.orderDate = -1;
        }

        console.log('DAO Query - Sort Orders:', sort); // Debug log

        // Find orders, populate product details, and apply sorting
        const orders = await Order.find({}) // Find all orders (add filters here if needed)
            .populate('productId') // Populate the referenced Product document
            .sort(sort);

        return orders;
    } catch (error) {
        console.error('Error fetching orders from DAO:', error);
        throw new Error('Database query failed while fetching orders.');
    }
};

/**
 * Finds a single order by its ID, populating product details.
 * @param orderId The ID of the order to find.
 * @param session Optional Mongoose client session for transactions.
 * @returns A promise that resolves to the order document or null if not found.
 * @throws Throws an error if the database query fails.
 */
export const findOrderById = async (orderId: string | mongoose.Types.ObjectId, session?: ClientSession): Promise<IOrder | null> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            console.warn('DAO: Invalid order ID format:', orderId);
            return null;
        }
        const order = await Order.findById(orderId).session(session || null).populate('productId');
        return order;
    } catch (error) {
        console.error(`Error fetching order with ID ${orderId} from DAO:`, error);
        throw new Error(`Database query failed while fetching order ID ${orderId}.`);
    }
};

/**
 * Updates the status of an order.
 * @param orderId The ID of the order to update.
 * @param status The new status ('Confirmed' or 'Canceled').
 * @param session Optional Mongoose client session for transactions.
 * @returns A promise that resolves to the updated order document or null if not found.
 * @throws Throws an error if the database update fails.
 */
export const updateOrderStatus = async (
    orderId: string | mongoose.Types.ObjectId,
    status: 'Confirmed' | 'Canceled',
    session?: ClientSession
): Promise<IOrder | null> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            console.warn('DAO: Invalid order ID format for status update:', orderId);
            return null;
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: status },
            { new: true, session }
        );
        return updatedOrder;
    } catch (error) {
        console.error(`Error updating status for order ID ${orderId} in DAO:`, error);
        throw new Error(`Database query failed while updating status for order ID ${orderId}.`);
    }
};

// Add other DAO functions later (findAllOrders, findOrderById, updateOrderStatus) 