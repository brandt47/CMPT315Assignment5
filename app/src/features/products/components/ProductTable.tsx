import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, setSorting, selectProductSorting } from '../../store/slices/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store/store';

interface ProductTableProps {
    products: Product[];
    onSort: (column: keyof Product | '', order: 'asc' | 'desc') => void; // Callback for sorting
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onSort }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { column: currentSortColumn, order: currentSortOrder } = useSelector(selectProductSorting);

    const handleRowClick = (productId: string, stock: number) => {
        if (stock > 0) {
            navigate(`/order/${productId}`);
        } else {
            // Optionally provide feedback that the item is out of stock
            console.log('Cannot order out-of-stock item.');
            // Maybe disable row click visually as well (see styles)
        }
    };

    const handleSortClick = (column: keyof Product | '') => {
        let newOrder: 'asc' | 'desc' = 'asc';
        if (column === currentSortColumn) {
            // If clicking the same column, toggle the order
            newOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            // If clicking a new column, default to ascending
            newOrder = 'asc';
        }
        onSort(column, newOrder); // Call the passed-in sorting handler
    };

    const renderSortArrow = (column: keyof Product | '') => {
        if (currentSortColumn === column) {
            return currentSortOrder === 'asc' ? ' ▲' : ' ▼';
        }
        return null;
    };

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    <th onClick={() => handleSortClick('name')} style={styles.th}>
                        Name {renderSortArrow('name')}
                    </th>
                    <th onClick={() => handleSortClick('price')} style={styles.th}>
                        Price {renderSortArrow('price')}
                    </th>
                    <th onClick={() => handleSortClick('stock')} style={styles.th}>
                        Stock {renderSortArrow('stock')}
                    </th>
                    <th onClick={() => handleSortClick('category')} style={styles.th}>
                        Category {renderSortArrow('category')}
                    </th>
                    <th style={styles.th}>Action</th>
                </tr>
            </thead>
            <tbody>
                {products.length === 0 ? (
                    <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>No products found.</td>
                    </tr>
                ) : (
                    products.map((product) => (
                        <tr
                            key={product._id}
                            style={product.stock === 0 ? styles.trDisabled : styles.tr}
                            onClick={() => handleRowClick(product._id, product.stock)}
                        >
                            <td style={styles.td}>{product.name}</td>
                            <td style={styles.td}>${product.price.toFixed(2)}</td>
                            <td style={styles.td}>{product.stock}</td>
                            <td style={styles.td}>{product.category}</td>
                            <td style={styles.td}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleRowClick(product._id, product.stock); }}
                                    disabled={product.stock === 0}
                                    style={styles.button}
                                >
                                    {product.stock > 0 ? 'Order' : 'Out of Stock'}
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};

// Basic styling (consider moving to CSS modules or styled-components)
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
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
    },
    trHover: { // You would need to add hover effects via CSS typically
         backgroundColor: '#f9f9f9',
    },
    trDisabled: {
        cursor: 'not-allowed',
        backgroundColor: '#fafafa',
        color: '#aaa',
    },
    button: {
        padding: '5px 10px',
        cursor: 'pointer',
    },
};


export default ProductTable; 