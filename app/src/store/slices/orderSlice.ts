import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define the type for a single order (align with backend model)
interface Order {
  _id: string;
  productId: string; // Or potentially populate the full product?
  quantity: number;
  emailId: string;
  deliveryDate: string; // Consider using Date object if needed
  status: 'Confirmed' | 'Canceled';
  orderDate: string; // Consider using Date object if needed
  // Potentially add populated product details if needed from backend
  // productDetails?: { name: string; price: number };
}

// Define the state structure for orders
interface OrderState {
  items: Order[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
  sorting: {
    column: keyof Order | null; // Adjust keys as needed
    order: 'asc' | 'desc';
  };
}

const initialState: OrderState = {
  items: [],
  loading: 'idle',
  error: null,
  sorting: {
    column: null,
    order: 'asc',
  },
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.items = action.payload;
      state.loading = 'succeeded';
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.items.push(action.payload); // Or add based on sorting
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: 'Confirmed' | 'Canceled' }>) => {
      const index = state.items.findIndex(order => order._id === action.payload.orderId);
      if (index !== -1) {
        state.items[index].status = action.payload.status;
      }
    },
    setLoading: (state, action: PayloadAction<OrderState['loading']>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = 'failed';
    },
    setSorting: (state, action: PayloadAction<{ column: keyof Order | null; order: 'asc' | 'desc' }>) => {
      state.sorting = action.payload;
    },
    // Add more reducers or async thunks for fetching/placing/canceling orders
  },
  // Example extraReducers for handling async thunks (add later)
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchOrders.pending, (state) => { /* ... */ })
  //     .addCase(fetchOrders.fulfilled, (state, action) => { /* ... */ })
  //     .addCase(fetchOrders.rejected, (state, action) => { /* ... */ })
  //     .addCase(placeOrder.fulfilled, (state, action) => { /* ... maybe add order */ })
  //     .addCase(cancelOrder.fulfilled, (state, action) => { /* ... update status */ });
  // },
});

export const {
  setOrders,
  addOrder,
  updateOrderStatus,
  setLoading,
  setError,
  setSorting,
} = orderSlice.actions;

// Selector to get the order state
export const selectOrdersState = (state: RootState) => state.orders;

export default orderSlice.reducer; 