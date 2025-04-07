import React from 'react';
import { Product, setSorting, selectProductSorting } from '../../../store/slices/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store/store';

interface ProductTableProps {
    products: Product[];
    onOrder: (productId: string) => void;
    isOrdering?: boolean;
}

const ProductTable: React.FC<ProductTableProps> = ({ products = [], onOrder, isOrdering }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { column: currentSortColumn, order: currentSortOrder } = useSelector(selectProductSorting);

    const handleSortClick = (column: keyof Product | '') => {
        let newOrder: 'asc' | 'desc' = 'asc';
        if (column === currentSortColumn) {
            newOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            newOrder = 'asc';
        }
        dispatch(setSorting({ column, order: newOrder }));
    };

    const renderSortArrow = (column: keyof Product | '') => {
        if (currentSortColumn === column) {
            return currentSortOrder === 'asc' ? ' ▲' : ' ▼';
        }
        return null;
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th onClick={() => handleSortClick('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                            Name {renderSortArrow('name')}
                        </th>
                        <th onClick={() => handleSortClick('category')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                            Category {renderSortArrow('category')}
                        </th>
                        <th onClick={() => handleSortClick('price')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                            Price {renderSortArrow('price')}
                        </th>
                        <th onClick={() => handleSortClick('stock')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                            Stock {renderSortArrow('stock')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No products found matching your criteria.</td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product._id} className={`${product.stock === 0 ? 'bg-gray-100 opacity-70' : 'hover:bg-gray-50'}`}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={(e) => { 
                                            e.stopPropagation();
                                            onOrder(product._id);
                                        }}
                                        disabled={product.stock === 0 || isOrdering}
                                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${product.stock > 0 ? 'text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' : 'text-gray-500 bg-gray-200'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {isOrdering ? 'Ordering...' : (product.stock > 0 ? 'Order' : 'Out of Stock')}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable; 