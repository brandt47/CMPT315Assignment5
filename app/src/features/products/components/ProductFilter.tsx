import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { setFilterCategory, setFilterPriceGte, setFilterPriceLte, selectProductFilters } from '../../../store/slices/productSlice';

const ProductFilter: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { category, price_gte, price_lte } = useSelector(selectProductFilters);
    const [minPrice, setMinPrice] = useState<string>(price_gte?.toString() || '');
    const [maxPrice, setMaxPrice] = useState<string>(price_lte?.toString() || '');
    const [selectedCategory, setSelectedCategory] = useState<string>(category || '');

    // TODO: Get categories dynamically from products or define them statically
    const categories = ['Electronics', 'Clothing', 'Groceries', 'Books', 'Home']; // Example categories

    useEffect(() => {
        // Dispatch filter updates whenever local state changes
        // Debouncing could be added here for price inputs if needed
        dispatch(setFilterCategory(selectedCategory || null));
        dispatch(setFilterPriceGte(minPrice ? parseFloat(minPrice) : null));
        dispatch(setFilterPriceLte(maxPrice ? parseFloat(maxPrice) : null));

    }, [selectedCategory, minPrice, maxPrice, dispatch]);

    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers and clear if invalid
        if (/^\d*\.?\d*$/.test(value)) {
            setMinPrice(value);
        } else if (value === '') {
            setMinPrice('');
        }
    };

    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setMaxPrice(value);
        } else if (value === '') {
            setMaxPrice('');
        }
    };

    return (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div>
                <label htmlFor="category-select" style={{ marginRight: '5px' }}>Category:</label>
                <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="min-price" style={{ marginRight: '5px' }}>Min Price:</label>
                <input
                    type="text" // Use text to allow temporary non-numeric input during typing
                    id="min-price"
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    placeholder="e.g., 10"
                    style={{ width: '80px' }}
                />
            </div>
            <div>
                <label htmlFor="max-price" style={{ marginRight: '5px' }}>Max Price:</label>
                <input
                    type="text"
                    id="max-price"
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    placeholder="e.g., 100"
                    style={{ width: '80px' }}
                />
            </div>
            {/* Maybe add a button to apply filters explicitly if auto-fetch is disabled */}
            {/* <button onClick={() => dispatch(fetchProducts({ category: selectedCategory || null, price_gte: minPrice ? parseFloat(minPrice) : null, price_lte: maxPrice ? parseFloat(maxPrice) : null, ... }))}>Apply Filters</button> */}
        </div>
    );
};

export default ProductFilter; 