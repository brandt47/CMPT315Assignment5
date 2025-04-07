import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { fetchProducts, selectAllProducts, selectProductsLoading, selectProductsError, selectProductFilters, selectProductSorting, setSorting, Product } from '../../store/slices/productSlice';
import ProductFilter from '../../features/products/components/ProductFilter';
import ProductTable from '../../features/products/components/ProductTable';

const DashboardPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const products = useSelector(selectAllProducts);
    const loading = useSelector(selectProductsLoading);
    const error = useSelector(selectProductsError);
    const filters = useSelector(selectProductFilters);
    const sorting = useSelector(selectProductSorting);

    // Fetch products when component mounts or when filters/sorting change
    useEffect(() => {
        const params = {
            category: filters.category,
            price_gte: filters.price_gte,
            price_lte: filters.price_lte,
            sort: sorting.column || undefined, // Send undefined if null/empty
            order: sorting.column ? sorting.order : undefined, // Send order only if column is set
        };
        dispatch(fetchProducts(params));
    }, [dispatch, filters, sorting]);

    const handleSort = (column: keyof Product | '', order: 'asc' | 'desc') => {
        dispatch(setSorting({ column, order }));
        // fetchProducts will be triggered by the useEffect dependency change
    };

    return (
        <div>
            <h2>Product Dashboard</h2>
            <ProductFilter />

            {loading === 'pending' && <p>Loading products...</p>}
            {error && <p style={{ color: 'red' }}>Error loading products: {error}</p>}
            {loading === 'succeeded' && !error && (
                <ProductTable products={products} onSort={handleSort} />
            )}
            {/* Handle 'idle' state if necessary, maybe show initial loading message */}
            {loading === 'idle' && <p>Initializing...</p>}
        </div>
    );
};

export default DashboardPage; 