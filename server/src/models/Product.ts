import mongoose, { Document, Schema } from 'mongoose';

// Interface defining the Product document structure
export interface IProduct extends Document {
  name: string;
  price: number;
  stock: number;
  category: string;
}

// Mongoose schema for the Product model
const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  category: { type: String, required: true },
});

// Create and export the Product model
const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product; 