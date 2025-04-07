import React from 'react';
import { Order, selectOrderSorting } from '../../../store/slices/orderSlice'; // Import Order type
import CancelOrderButton from './CancelOrderButton';
import { useSelector } from 'react-redux';

// Define the keys that are valid for sorting
type SortableOrderColumn = keyof Pick<Order, 'emailId' | 'quantity' | 'deliveryDate' | 'orderDate' | 'status'> | 'productName' | 'productPrice' | '';

interface OrderTableProps {
    orders: Order[];
    onSort: (column: SortableOrderColumn, order: 'asc' | 'desc') => void; // Callback for sorting
}

// Helper to format date string (assuming YYYY-MM-DD or ISO string)
const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Adjust format as needed
    } catch (e) {
        return dateString; // Return original if parsing fails
    }
};

const OrderTable: React.FC<OrderTableProps> = ({ orders = [], onSort }) => {
    const { column: currentSortColumn, order: currentSortOrder } = useSelector(selectOrderSorting);

    const handleSortClick = (column: SortableOrderColumn) => {
        let newOrder: 'asc' | 'desc' = 'asc';
        if (column === currentSortColumn) {
            newOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            newOrder = 'asc';
        }
        onSort(column, newOrder);
    };

    const renderSortArrow = (column: SortableOrderColumn) => {
        if (currentSortColumn === column) {
            return currentSortOrder === 'asc' ? ' ▲' : ' ▼';
        }
        return null;
    };

    // Helper to get product name (handles populated vs. ID)
    const getProductName = (order: Order): string => {
        if (typeof order.productId === 'object' && order.productId?.name) {
            return order.productId.name;
        } else if (order.productDetails?.name) {
            return order.productDetails.name; // Use productDetails if available
        }
        // Fallback or indicate if name is unavailable
        return typeof order.productId === 'string' ? order.productId : 'N/A';
    };

     // Helper to get product price
    const getProductPrice = (order: Order): string => {
        const price = typeof order.productId === 'object' && order.productId !== null ? order.productId.price : order.productDetails?.price;
        return price !== undefined ? `$${price.toFixed(2)}` : 'N/A';
    };

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
                <tr>
                    {/* Add sorting for product details if API supports it */}
                    {/* For now, assume sorting on backend is by fields in Order model */}
                    <th onClick={() => handleSortClick('productName')} style={styles.th}>
                        Product {renderSortArrow('productName')} {/* Client-side sort or requires backend support */}
                    </th>
                     <th onClick={() => handleSortClick('productPrice')} style={styles.th}>
                        Price {renderSortArrow('productPrice')}
                    </th>
                    <th onClick={() => handleSortClick('quantity')} style={styles.th}>
                        Quantity {renderSortArrow('quantity')}
                    </th>
                    <th onClick={() => handleSortClick('emailId')} style={styles.th}>
                        Email {renderSortArrow('emailId')}
                    </th>
                    <th onClick={() => handleSortClick('deliveryDate')} style={styles.th}>
                        Delivery Date {renderSortArrow('deliveryDate')}
                    </th>
                    <th onClick={() => handleSortClick('orderDate')} style={styles.th}>
                        Order Date {renderSortArrow('orderDate')}
                    </th>
                    <th onClick={() => handleSortClick('status')} style={styles.th}>
                        Status {renderSortArrow('status')}
                    </th>
                    <th style={styles.th}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {orders.length === 0 ? (
                    <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>No orders found.</td>
                    </tr>
                ) : (
                    orders.map((order) => (
                        <tr key={order._id} style={order.status === 'Canceled' ? styles.trCanceled : styles.tr}>
                            <td style={styles.td}>{getProductName(order)}</td>
                            <td style={styles.td}>{getProductPrice(order)}</td>
                            <td style={styles.td}>{order.quantity}</td>
                            <td style={styles.td}>{order.emailId}</td>
                            <td style={styles.td}>{formatDate(order.deliveryDate)}</td>
                            <td style={styles.td}>{formatDate(order.orderDate)}</td>
                            <td style={styles.td}>{order.status}</td>
                            <td style={styles.td}>
                                {order.status === 'Confirmed' && (
                                    <CancelOrderButton orderId={order._id} deliveryDate={order.deliveryDate} />
                                )}
                                {order.status === 'Canceled' && <span>-</span>}
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};

// Basic styling
const styles: { [key: string]: React.CSSProperties } = {
    th: {
        borderBottom: '2px solid #ddd',
        padding: '10px',
        textAlign: 'left',
        cursor: 'pointer',
        backgroundColor: '#f2f2f2',
    },
    td: {
        borderBottom: '1px solid #eee',
        padding: '10px',
    },
     tr: {
        // Normal row style
    },
    trCanceled: {
        backgroundColor: '#f8f8f8',
        color: '#999',
        fontStyle: 'italic',
    },
};

export default OrderTable; 