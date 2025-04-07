import express from 'express';
import ProductController from '../controllers/productController'; // Import the controller
// import {Schemas, ValidateSchema} from '../middlewares/Validation'; // Placeholder for validation

const router = express.Router();

// Define product routes
router.get('/', ProductController.getProducts); // Route for GET /api/products (with optional query params)
router.get('/:id', ProductController.getProductById); // Route for GET /api/products/:id

// Add routes for filtering, sorting, and getting by ID as needed

export = router; 