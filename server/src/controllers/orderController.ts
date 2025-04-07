import { Request, Response } from 'express';
import * as orderService from '../services/orderService';
import { AppError } from '../utils/AppError';
import { CreateOrderData } from '../daos/orderDao'; // Import the type
import mongoose from 'mongoose'; // Needed for ID validation in cancelOrder

/**
 * Controller: Place a new order.
 */
export const placeOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderData: CreateOrderData = req.body;
        // Basic validation
        if (!orderData.productId || !orderData.quantity || !orderData.emailId || !orderData.deliveryDate) {
            res.status(400).json({ message: 'Missing required order fields: productId, quantity, emailId, deliveryDate' });
            return;
        }
        const newOrder = await orderService.placeOrder(orderData);
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error in order controller placeOrder:', error);
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unexpected error occurred while placing the order.' });
        }
    }
};

/**
 * Controller: Get all orders with sorting.
 */
export const getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sort, order } = req.query;
        const options = {
            sort: sort as string | undefined,
            order: order as 'asc' | 'desc' | undefined,
        };
        Object.keys(options).forEach(key => options[key as keyof typeof options] === undefined && delete options[key as keyof typeof options]);

        const orders = await orderService.getAllOrders(options);
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error in order controller getOrders:', error);
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to retrieve orders' });
        }
    }
};

/**
 * Controller: Cancel an order by ID.
 */
export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.id;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            res.status(400).json({ message: 'Invalid Order ID format' });
            return;
        }

        const canceledOrder = await orderService.cancelOrder(orderId);
        res.status(200).json(canceledOrder);

    } catch (error) {
        console.error(`Error in order controller cancelOrder for ID ${req.params.id}:`, error);
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to cancel order' });
        }
    }
}; 