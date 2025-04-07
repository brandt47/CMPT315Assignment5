import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { PlaceOrderPayload } from '../../services/api'; // Use payload type from api service
import { placeOrder, clearOrderError } from '../../store/slices/orderSlice';
import { Product } from '../../store/slices/productSlice';

interface OrderFormProps {
    product: Product;
    onSubmitSuccess: () => void; // Callback on successful order
    onPlaceOrder: (payload: PlaceOrderPayload) => Promise<any>; // Function to dispatch placeOrder thunk
    orderError: any | null;
    isPlacingOrder: boolean;
}

const OrderForm: React.FC<OrderFormProps> = ({ product, onSubmitSuccess, onPlaceOrder, orderError, isPlacingOrder }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [quantity, setQuantity] = useState<number>(1); // Default quantity to 1
    const [email, setEmail] = useState<string>('');
    const [deliveryDate, setDeliveryDate] = useState<string>(''); // Store as YYYY-MM-DD string
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null); // Clear previous validation errors
        dispatch(clearOrderError()); // Clear previous API errors

        // Basic Validation
        if (quantity <= 0) {
            setValidationError('Quantity must be greater than zero.');
            return;
        }
        if (quantity > product.stock) {
            setValidationError(`Quantity cannot exceed available stock (${product.stock}).`);
            return;
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) { // Simple email format check
            setValidationError('Please enter a valid email address.');
            return;
        }
        if (!deliveryDate) {
            setValidationError('Please select a delivery date.');
            return;
        }
        // Optional: Add validation for delivery date (e.g., not in the past)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to the start of the day
        const selectedDate = new Date(deliveryDate + 'T00:00:00'); // Ensure correct date parsing
        if (selectedDate < today) {
             setValidationError('Delivery date cannot be in the past.');
             return;
        }

        const payload: PlaceOrderPayload = {
            productId: product._id,
            quantity,
            emailId: email,
            deliveryDate, // Send as YYYY-MM-DD string
        };

        try {
            // Call the passed-in function which dispatches the thunk
            const resultAction = await onPlaceOrder(payload);
            // Check if the thunk completed successfully using unwrap (or check action type)
            if (placeOrder.fulfilled.match(resultAction)) {
                 console.log('Order placed successfully!', resultAction.payload);
                 onSubmitSuccess(); // Trigger navigation or other success actions
            } else {
                // Error handled by the slice/selector, but can log here if needed
                 console.error('Order placement failed:', resultAction.payload);
                 // The orderError prop will be updated via Redux state
            }
        } catch (err) {
            // Should be caught by thunk's rejectWithValue, but safety catch
            console.error("Unexpected error during order placement:", err);
            setValidationError("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px', border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
            <h4>Place Your Order</h4>
            {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
            {orderError && (
                 <p style={{ color: 'red' }}>
                    Error placing order: {typeof orderError === 'string' ? orderError : orderError.message}
                 </p>
            )}
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="quantity" style={{ marginRight: '10px' }}>Quantity:</label>
                <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} // Ensure positive number
                    min="1"
                    max={product.stock} // Set max based on stock
                    required
                    style={{ width: '70px' }}
                />
                <span style={{ marginLeft: '10px' }}>(Available: {product.stock})</span>
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="email" style={{ marginRight: '10px' }}>Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your.email@example.com"
                    style={{ width: '250px' }}
                />
            </div>
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="deliveryDate" style={{ marginRight: '10px' }}>Delivery Date:</label>
                <input
                    type="date"
                    id="deliveryDate"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    required
                     min={new Date().toISOString().split('T')[0]} // Set min date to today
                />
            </div>
            <button type="submit" disabled={isPlacingOrder} style={{ padding: '10px 15px' }}>
                {isPlacingOrder ? 'Placing Order...' : 'Confirm Order'}
            </button>
        </form>
    );
};

export default OrderForm; 