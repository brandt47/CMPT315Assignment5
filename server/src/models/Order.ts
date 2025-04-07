import mongoose, { Document, Schema } from 'mongoose';

// Interface defining the Order document structure
export interface IOrder extends Document {
  productId: mongoose.Types.ObjectId; // Reference to the Product model
  quantity: number;
  emailId: string;
  deliveryDate: Date;
  status: 'Confirmed' | 'Canceled';
  orderDate: Date;
}

// Mongoose schema for the Order model
const OrderSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  emailId: { type: String, required: true }, // Add validation if needed (e.g., regex)
  deliveryDate: { type: Date, required: true },
  status: { type: String, enum: ['Confirmed', 'Canceled'], default: 'Confirmed', required: true },
  orderDate: { type: Date, default: Date.now },
});

// Create and export the Order model
const Order = mongoose.model<IOrder>('Order', OrderSchema);
export default Order; 