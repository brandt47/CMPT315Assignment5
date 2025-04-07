import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { fetchOrders, selectAllOrders, selectOrdersLoading, selectOrdersError, selectOrderSorting, setSorting, Order } from '../../store/slices/orderSlice';
import OrderTable from '../../features/orders/components/OrderTable';
import { useNavigate } from 'react-router-dom';

// Define SortableOrderColumn matching the one in OrderTable
type SortableOrderColumn = keyof Pick<Order, 'emailId' | 'quantity' | 'deliveryDate' | 'orderDate' | 'status'> | 'productName' | 'productPrice' | '';

const OrdersListPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const orders = useSelector(selectAllOrders);
    const loading = useSelector(selectOrdersLoading);
    const error = useSelector(selectOrdersError);
    const sorting = useSelector(selectOrderSorting);

    // Fetch orders when component mounts or sorting changes
    useEffect(() => {
        const params = {
            sort: sorting.column || undefined,
            order: sorting.column ? sorting.order : undefined,
        };
        dispatch(fetchOrders(params));
    }, [dispatch, sorting]);

    const handleSort = (column: SortableOrderColumn, order: 'asc' | 'desc') => {
         // Map frontend column names (like productName) to backend sort fields if necessary
        let backendSortColumn: string | undefined = column === '' ? undefined : column;
        // If your backend API expects different field names for sorting populated fields:
        // if (column === 'productName') {
        //     backendSortColumn = 'productId.name'; // Example if backend supports this
        // } else if (column === 'productPrice') {
        //     backendSortColumn = 'productId.price';
        // }

        dispatch(setSorting({ column, order }));
        // The useEffect will trigger the fetch with the *new* sorting state (which includes the potentially mapped column)
         // However, the `setSorting` action itself uses the frontend column name.
         // We need to fetch using the backend column name derived here.
        // dispatch(fetchOrders({ sort: backendSortColumn, order: order }));
        // ^^^ Re-evaluating: useEffect handles fetching based on state change, so direct dispatch might be redundant
        // Ensure the sorting state in Redux holds the column name the UI uses (like 'productName')
        // And the useEffect translates it to the backend name when fetching.

        // Corrected approach: Update state first, let useEffect handle the fetch
        dispatch(setSorting({ column, order }));

    };

    return (
        <div>
            <h2>My Orders</h2>

            {loading === 'pending' && <p>Loading orders...</p>}
            {/* Display specific cancellation errors if needed */}
            {error && <p style={{ color: 'red' }}>Error: { typeof error === 'string' ? error : error.message || 'Failed to load or update orders.' }</p>}

            {loading === 'succeeded' && !error && (
                <OrderTable orders={orders} onSort={handleSort} />
            )}
            {loading === 'idle' && !error && orders.length === 0 && <p>You haven't placed any orders yet.</p>}
            {loading === 'idle' && !error && orders.length > 0 && (
                 <OrderTable orders={orders} onSort={handleSort} /> // Show table in idle state if orders exist
            )}

            <button onClick={() => navigate('/')} style={{ marginTop: '20px' }}>Back to Dashboard</button>
        </div>
    );
};

export default OrdersListPage; 