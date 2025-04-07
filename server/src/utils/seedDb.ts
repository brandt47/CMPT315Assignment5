import mongoose, { Document } from 'mongoose';
import Product, { IProduct } from '../models/Product';
// import { MONGO_URI } from '../config/db'; // Removed this import
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cmpt315_assignment5_db';

// Define a type for the seed data structure, excluding Mongoose Document properties
type ProductSeedData = Omit<IProduct, keyof Document | '_id'>;

const seedProducts: ProductSeedData[] = [
  { name: 'Laptop', price: 1200, stock: 50, category: 'Electronics' },
  { name: 'Keyboard', price: 75, stock: 100, category: 'Electronics' },
  { name: 'Mouse', price: 25, stock: 150, category: 'Electronics' },
  { name: 'Monitor', price: 300, stock: 30, category: 'Electronics' },
  { name: 'Webcam', price: 50, stock: 80, category: 'Electronics' },
  { name: 'Desk Chair', price: 150, stock: 40, category: 'Furniture' },
  { name: 'Standing Desk', price: 400, stock: 20, category: 'Furniture' },
  { name: 'Bookshelf', price: 100, stock: 0, category: 'Furniture' }, // Zero stock
  { name: 'Notebook', price: 5, stock: 200, category: 'Stationery' },
  { name: 'Pen Set', price: 15, stock: 300, category: 'Stationery' },
  { name: 'Backpack', price: 60, stock: 70, category: 'Accessories' },
  { name: 'Water Bottle', price: 20, stock: 120, category: 'Accessories' },
  { name: 'Coffee Mug', price: 12, stock: 90, category: 'Accessories' },
  { name: 'Headphones', price: 180, stock: 0, category: 'Electronics' }, // Zero stock
  { name: 'Smartphone', price: 800, stock: 60, category: 'Electronics' },
  { name: 'Desk Lamp', price: 35, stock: 55, category: 'Furniture' },
];

const seedDB = async () => {
  if (!MONGO_URI) {
    console.error('MongoDB connection string not found. Please set MONGODB_URI environment variable.');
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Optional: Clear existing products before seeding
    await Product.deleteMany({});
    console.log('Existing products cleared.');

    // Insert new products
    await Product.insertMany(seedProducts); // No cast needed now
    console.log('Database seeded successfully!');

  } catch (err: any) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected after seeding.');
  }
};

// Execute the seeding function if the script is run directly
if (require.main === module) {
  seedDB();
}

export default seedDB; 