import mongoose, { Document, ConnectionStates } from 'mongoose';
import Product, { IProduct } from '../models/Product';
import {config} from '../config';
import Order from '../models/Order';

// Define a type for the seed data structure, excluding Mongoose Document properties
type ProductSeedData = Omit<IProduct, keyof Document | '_id'>;

const seedProducts: ProductSeedData[] = [
  { name: 'Laptop', price: 1200, stock: 7, category: 'Electronics' },
  { name: 'Keyboard', price: 75, stock: 2, category: 'Electronics' },
  { name: 'Mouse', price: 25, stock: 4, category: 'Electronics' },
  { name: 'Monitor', price: 300, stock: 0, category: 'Electronics' },
  { name: 'Webcam', price: 50, stock: 11, category: 'Electronics' },
  { name: 'Desk Chair', price: 150, stock: 3, category: 'Furniture' },
  { name: 'Standing Desk', price: 400, stock: 2, category: 'Furniture' },
  { name: 'Bookshelf', price: 100, stock: 8, category: 'Furniture' },
  { name: 'Notebook', price: 5, stock: 2, category: 'Stationery' },
  { name: 'Pen Set', price: 15, stock: 14, category: 'Stationery' },
  { name: 'Backpack', price: 60, stock: 6, category: 'Accessories' },
  { name: 'Water Bottle', price: 20, stock: 9, category: 'Accessories' },
  { name: 'Coffee Mug', price: 12, stock: 1, category: 'Accessories' },
  { name: 'Headphones', price: 180, stock: 1, category: 'Electronics' },
  { name: 'Smartphone', price: 800, stock: 5, category: 'Electronics' },
  { name: 'Desk Lamp', price: 35, stock: 3, category: 'Furniture' },
];

const seedDB = async () => {
  // Rely on the connection established in server.ts
  try {
    // Optional: Clear existing products before seeding
    // Ensure connection is ready before operations
    // if (mongoose.connection.readyState !== ConnectionStates.connected) {
    //   console.log('MongoDB connection not ready for seeding. Waiting...');
    //   // Optional: Add a short delay or wait for connection event
    //   // This example proceeds assuming the connection will be ready
    //   // A more robust implementation might listen for the 'connected' event
    //   // if called before the connection is fully established elsewhere.
    //   await new Promise(resolve => setTimeout(resolve, 1000)); // Simple delay
    //   if (mongoose.connection.readyState !== ConnectionStates.connected) {
    //     throw new Error('MongoDB connection failed to establish in time for seeding.');
    //   }
    // }
    console.log('Checking if seeding is needed...');
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('Existing products cleared.');

    // Insert new products
    await Product.insertMany(seedProducts); // No cast needed now
    console.log('Database seeded successfully!');

  } catch (err: any) {
    console.error('Seeding error:', err.message);
    // Decide if seeding failure should stop the server.
    // process.exit(1); // Removed as it might stop the server undesirably
  }
  // Removed finally block with disconnect
};

// Execute the seeding function if the script is run directly
// seedDB(); // Removed direct execution

export default seedDB; 