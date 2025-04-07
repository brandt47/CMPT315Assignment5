import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define the type for a single product (align with backend model)
interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

// Define the state structure for products
interface ProductState {
  items: Product[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    category: string | null;
    price_gte: number | null;
    price_lte: number | null;
  };
  sorting: {
    column: keyof Product | null;
    order: 'asc' | 'desc';
  };
}

const initialState: ProductState = {
  items: [],
  loading: 'idle',
  error: null,
  filters: {
    category: null,
    price_gte: null,
    price_lte: null,
  },
  sorting: {
    column: null,
    order: 'asc',
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      state.loading = 'succeeded';
    },
    setLoading: (state, action: PayloadAction<ProductState['loading']>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = 'failed';
    },
    setFilterCategory: (state, action: PayloadAction<string | null>) => {
      state.filters.category = action.payload;
    },
    setFilterPriceGte: (state, action: PayloadAction<number | null>) => {
      state.filters.price_gte = action.payload;
    },
    setFilterPriceLte: (state, action: PayloadAction<number | null>) => {
      state.filters.price_lte = action.payload;
    },
    setSorting: (state, action: PayloadAction<{ column: keyof Product | null; order: 'asc' | 'desc' }>) => {
      state.sorting = action.payload;
    },
    // Add more reducers or async thunks for fetching products etc.
  },
  // Example extraReducers for handling async thunks (add later)
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchProducts.pending, (state) => {
  //       state.loading = 'pending';
  //     })
  //     .addCase(fetchProducts.fulfilled, (state, action) => {
  //       state.items = action.payload;
  //       state.loading = 'succeeded';
  //     })
  //     .addCase(fetchProducts.rejected, (state, action) => {
  //       state.error = action.error.message || 'Failed to fetch products';
  //       state.loading = 'failed';
  //     });
  // },
});

export const {
  setProducts,
  setLoading,
  setError,
  setFilterCategory,
  setFilterPriceGte,
  setFilterPriceLte,
  setSorting,
} = productSlice.actions;

// Selector to get the product state
export const selectProductsState = (state: RootState) => state.products;

export default productSlice.reducer; 