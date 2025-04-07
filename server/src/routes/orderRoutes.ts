import express from 'express';
// Import named controller functions
import { placeOrder, getOrders, cancelOrder } from '../controllers/orderController';
// import {Schemas, ValidateSchema} from '../middlewares/Validation'; // Placeholder for validation

const router = express.Router();

// Define order routes
router.post('/', /* ValidateSchema(Schemas.order.create), */ placeOrder); // Route for POST /api/orders
router.get('/', getOrders); // Route for GET /api/orders (with optional sort query params)
router.put('/cancel/:id', /* ValidateSchema(Schemas.order.cancel), */ cancelOrder); // Route for PUT /api/orders/cancel/:id

export = router; 