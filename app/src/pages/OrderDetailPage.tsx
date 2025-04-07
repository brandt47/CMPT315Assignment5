import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { fetchProductById, selectSelectedProduct, selectSelectedProductLoading, selectProductsError, clearSelectedProduct } from '../../store/slices/productSlice';
import { placeOrder, selectPlacingOrderStatus, selectOrdersError, clearOrderError } from '../../store/slices/orderSlice';
import OrderForm from '../../features/orders/components/OrderForm';
import { PlaceOrderPayload } from '../../services/api';

const OrderDetailPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const product = useSelector(selectSelectedProduct);
    const loading = useSelector(selectSelectedProductLoading);
    const productError = useSelector(selectProductsError);
    const isPlacingOrder = useSelector(selectPlacingOrderStatus) === 'pending';
    const orderError = useSelector(selectOrdersError); // Get order-specific errors

    useEffect(() => {
        if (productId) {
            dispatch(fetchProductById(productId));
        }

        // Cleanup function to clear selected product and order errors when leaving the page
        return () => {
            dispatch(clearSelectedProduct());
            dispatch(clearOrderError());
        };
    }, [dispatch, productId]);

    const handleOrderSubmitSuccess = () => {
        // Redirect to orders list page after successful order
        navigate('/orders');
        // Optionally, add a success notification here
    };

    // Function to pass down to OrderForm that dispatches the placeOrder thunk
    const handlePlaceOrder = async (payload: PlaceOrderPayload) => {
       return dispatch(placeOrder(payload)); // Return the promise from dispatch
    };

    if (loading === 'pending' || loading === 'idle') {
        return <p>Loading product details...</p>;
    }

    if (productError) {
        // Use productError for issues fetching the product itself
        return <p style={{ color: 'red' }}>Error loading product: {productError}</p>;
    }

    if (!product) {
        return <p>Product not found.</p>;
    }

    if (product.stock === 0) {
        return (
             <div>
                 <h2>Order Product</h2>
                 <h3>{product.name}</h3>
                 <p>Category: {product.category}</p>
                 <p>Price: ${product.price.toFixed(2)}</p>
                 <p style={{ color: 'orange', fontWeight: 'bold' }}>This product is currently out of stock and cannot be ordered.</p>
                 <button onClick={() => navigate('/')} style={{ marginTop: '15px' }}>Back to Dashboard</button>
             </div>
         );
    }

    return (
        <div>
            <h2>Order Product</h2>
            <h3>{product.name}</h3>
            <p>Category: {product.category}</p>
            <p>Price: ${product.price.toFixed(2)}</p>
            {/* Display current stock before the form */}
            {/* <p>Available Stock: {product.stock}</p> */}

            <OrderForm
                product={product}
                onSubmitSuccess={handleOrderSubmitSuccess}
                onPlaceOrder={handlePlaceOrder} // Pass the dispatching function
                orderError={orderError} // Pass order-specific error
                isPlacingOrder={isPlacingOrder}
            />

             <button onClick={() => navigate('/')} style={{ marginTop: '15px' }}>Back to Dashboard</button>
        </div>
    );
};

export default OrderDetailPage; 