import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import * as api from '../../services/api'; // Import the API service

// Define the type for a single product (align with backend model)
export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

// Define the state structure for products
interface ProductState {
  items: Product[];
  selectedProduct: Product | null; // For the detail page
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  loadingSelected: 'idle' | 'pending' | 'succeeded' | 'failed'; // Loading state for single product fetch
  error: string | null;
  filters: {
    category: string | null;
    price_gte: number | null;
    price_lte: number | null;
  };
  sorting: {
    column: keyof Product | '' | null; // Allow empty string or null
    order: 'asc' | 'desc';
  };
}

const initialState: ProductState = {
  items: [],
  selectedProduct: null,
  loading: 'idle',
  loadingSelected: 'idle',
  error: null,
  filters: {
    category: null,
    price_gte: null,
    price_lte: null,
  },
  sorting: {
    column: '', // Default to no sorting column
    order: 'asc',
  },
};

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: api.ProductQueryParams, { rejectWithValue }) => {
    try {
      const response = await api.getProducts(params);
      return response.data; // Assuming backend returns array of products
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch products');
    }
  }
);

// Async thunk for fetching a single product by ID
export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (productId: string, { rejectWithValue }) => {
      try {
        const response = await api.getProductById(productId);
        return response.data; // Assuming backend returns a single product object
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch product details');
      }
    }
);

// Async thunk for updating product stock (called internally after order actions)
// Note: This assumes the backend doesn't automatically return the updated product.
// If it does, this might not be needed or could be integrated differently.
export const updateProductStock = createAsyncThunk(
    'products/updateStock',
    async ({ productId, change }: { productId: string; change: number }) => {
        // We don't call an API endpoint here directly, this is for client-side state update.
        // Or, if needed, call a dedicated fetchProductById again.
        // Let's just update the local state for now for simplicity.
        // For robust sync, re-fetching the product or list might be better.
        return { productId, change };
    }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Keep synchronous reducers for immediate UI updates like setting filters/sorting
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      // Reset loading state if needed, but extraReducers handle async loading
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
    setSorting: (state, action: PayloadAction<{ column: keyof Product | '' | null; order: 'asc' | 'desc' }>) => {
      state.sorting = action.payload;
    },
    clearSelectedProduct: (state) => {
        state.selectedProduct = null;
        state.loadingSelected = 'idle';
        state.error = null; // Clear previous errors if any
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.items = action.payload;
        state.loading = 'succeeded';
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = 'failed';
      })
      // Fetch Product By ID
      .addCase(fetchProductById.pending, (state) => {
          state.loadingSelected = 'pending';
          state.selectedProduct = null; // Clear previous selection
          state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
          state.selectedProduct = action.payload;
          state.loadingSelected = 'succeeded';
      })
      .addCase(fetchProductById.rejected, (state, action) => {
          state.error = action.payload as string;
          state.loadingSelected = 'failed';
      })
      // Update Product Stock (local state update example)
      .addCase(updateProductStock.fulfilled, (state, action) => {
          const { productId, change } = action.payload;
          const productIndex = state.items.findIndex(p => p._id === productId);
          if (productIndex !== -1) {
              state.items[productIndex].stock += change;
          }
          // Also update selected product if it matches
          if (state.selectedProduct?._id === productId) {
              state.selectedProduct.stock += change;
          }
      });
  },
});

export const {
  setProducts, // Keep if needed for direct setting, maybe remove later
  setLoading, // Keep or remove based on usage
  setError,
  setFilterCategory,
  setFilterPriceGte,
  setFilterPriceLte,
  setSorting,
  clearSelectedProduct,
} = productSlice.actions;

// Selector to get the product state
export const selectProductsState = (state: RootState) => state.products;
export const selectAllProducts = (state: RootState) => state.products.items;
export const selectProductFilters = (state: RootState) => state.products.filters;
export const selectProductSorting = (state: RootState) => state.products.sorting;
export const selectSelectedProduct = (state: RootState) => state.products.selectedProduct;
export const selectProductsLoading = (state: RootState) => state.products.loading;
export const selectSelectedProductLoading = (state: RootState) => state.products.loadingSelected;
export const selectProductsError = (state: RootState) => state.products.error;

export default productSlice.reducer; 