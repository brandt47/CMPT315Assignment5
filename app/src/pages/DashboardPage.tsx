import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../store/store';
import { fetchProducts, selectAllProducts, selectProductsLoading, selectProductsError, selectProductFilters, selectProductSorting } from '../store/slices/productSlice';
import { placeOrder, selectOrdersLoading, selectOrdersError } from '../store/slices/orderSlice';
import ProductFilter from '../features/products/components/ProductFilter';
import ProductTable from '../features/products/components/ProductTable';

const DashboardPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const products = useSelector(selectAllProducts);
    const loadingProducts = useSelector(selectProductsLoading);
    const errorProducts = useSelector(selectProductsError);
    const filters = useSelector(selectProductFilters);
    const sorting = useSelector(selectProductSorting);
    const loadingOrder = useSelector(selectOrdersLoading);
    const errorOrder = useSelector(selectOrdersError);

    const [email, setEmail] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [orderError, setOrderError] = useState<string | null>(null);

    useEffect(() => {
        const params = {
            category: filters.category,
            price_gte: filters.price_gte,
            price_lte: filters.price_lte,
            sort: sorting.column || undefined,
            order: sorting.column ? sorting.order : undefined,
        };
        dispatch(fetchProducts(params));
    }, [dispatch, filters, sorting]);

    const handleOrder = async (productId: string) => {
        setOrderError(null);
        if (!email) {
            setOrderError('Please enter an email address.');
            return;
        }
        if (!deliveryDate) {
            setOrderError('Please select a delivery date.');
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(deliveryDate);
        if (selectedDate < today) {
            setOrderError('Delivery date cannot be in the past.');
            return;
        }

        const orderPayload = {
            productId,
            quantity: 1,
            emailId: email,
            deliveryDate,
        };

        try {
            await dispatch(placeOrder(orderPayload)).unwrap();
            navigate('/orders');
        } catch (err: any) {
            setOrderError(err.message || 'Failed to place order. Please try again.');
        }
    };

    return (
        <div>
            <h2>Product Dashboard</h2>
            <ProductFilter />

            <div className="my-4 p-4 border rounded bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">Order Details</h3>
                {(orderError || errorOrder) && (
                    <p className="text-red-600 mb-2">Error: {orderError || errorOrder}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700">Delivery Date:</label>
                        <input
                            type="date"
                            id="deliveryDate"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                </div>
            </div>

            {loadingProducts === 'pending' && <p>Loading products...</p>}
            {errorProducts && <p className="text-red-600">Error loading products: {errorProducts}</p>}
            {loadingProducts === 'succeeded' && !errorProducts && (
                <ProductTable
                    products={products}
                    onOrder={handleOrder}
                    isOrdering={loadingOrder === 'pending'}
                />
            )}
            {loadingProducts === 'idle' && <p>Initializing...</p>}
        </div>
    );
};

export default DashboardPage; 