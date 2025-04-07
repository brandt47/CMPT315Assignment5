import { Express, Router } from 'express';
// Use require for routes exported with 'export = router'
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');

const mainRouter: Router = Router();

// Delegate requests starting with /products to productRoutes
mainRouter.use('/products', productRoutes);

// Delegate requests starting with /orders to orderRoutes
mainRouter.use('/orders', orderRoutes);

// Function to register all routes with the Express app
export const registerRoutes = (app: Express) => {
    app.use('/api', mainRouter); // Mount all routes under /api
};