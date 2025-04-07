import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import * as api from '../../services/api'; // Import the API service
import { Product, updateProductStock } from './productSlice'; // Import Product type and stock update thunk

// Define the type for a single order (align with backend model)
// Let's enhance it slightly to potentially include populated product details
export interface Order {
  _id: string;
  productId: string | Product; // Could be ID or populated object
  quantity: number;
  emailId: string;
  deliveryDate: string; // Keep as string, format YYYY-MM-DD for date picker compatibility
  status: 'Confirmed' | 'Canceled';
  orderDate: string; // ISO String likely
  // Define what a populated product looks like if the API provides it
  productDetails?: {
      _id: string;
      name: string;
      price: number;
  };
}

// Define the state structure for orders
interface OrderState {
  items: Order[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null | any; // Allow for different error types
  placingOrder: 'idle' | 'pending' | 'succeeded' | 'failed'; // Separate loading state for placing
  cancelingOrder: Record<string, 'idle' | 'pending' | 'succeeded' | 'failed'>; // Track cancellation status per order ID
  sorting: {
    column: keyof Order | 'productName' | 'productPrice' | '' | null; // Add keys for populated fields if needed, allow empty
    order: 'asc' | 'desc';
  };
  email: string; // Add email state
}

const initialState: OrderState = {
  items: [],
  loading: 'idle',
  error: null,
  placingOrder: 'idle',
  cancelingOrder: {},
  sorting: {
    column: '', // Default to no sorting
    order: 'asc',
  },
  email: '', // Initialize email
};

// --- Async Thunks ---

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params: api.OrderQueryParams, { rejectWithValue }) => {
    try {
      const response = await api.getOrders(params);
      // TODO: Potentially process/map the response data if needed
      // e.g., ensure date formats are consistent
      return response as Order[]; // Assert type
    } catch (error: any) {
      return rejectWithValue(error.response?.message || error.message || 'Failed to fetch orders');
    }
  }
);

export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  // Remove emailId from payload type, we'll get it from state
  async (payload: Omit<api.PlaceOrderPayload, 'emailId'>, { dispatch, getState, rejectWithValue }) => {
    try {
      // Get email from the state
      const state = getState() as RootState;
      const emailId = state.orders.email;
      if (!emailId) {
        return rejectWithValue({ message: 'Email address is required.', type: 'VALIDATION_ERROR' });
      }

      // Construct the full payload including the email from state
      const fullPayload: api.PlaceOrderPayload = {
        ...payload,
        emailId,
      };

      const response = await api.placeOrder(fullPayload);
      // After successful order placement, dispatch action to update product stock locally
      // The backend transaction should have already decremented it, this keeps FE state consistent
      dispatch(updateProductStock({ productId: payload.productId, change: -payload.quantity }));
      return response as Order; // Return the newly created order
    } catch (error: any) {
        // Check for specific backend error messages if available
        const errorMessage = error.response?.data?.message || error.message || 'Failed to place order';
        if (error.response?.data?.error === 'INSUFFICIENT_STOCK') {
             return rejectWithValue({ message: 'Insufficient stock available for the requested quantity.', type: 'STOCK_ERROR' });
        }
        // You might want to handle other specific errors here
        return rejectWithValue({ message: errorMessage, type: 'GENERAL_ERROR' });
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId: string, { getState, dispatch, rejectWithValue }) => {
    try {
      // Find the order details to get quantity and productId for stock restoration
      const state = getState() as RootState;
      const orderToCancel = state.orders.items.find((order: Order) => order._id === orderId);

      if (!orderToCancel) {
        return rejectWithValue('Order not found locally.');
      }

      const response = await api.cancelOrder(orderId);

      // After successful cancellation, update product stock locally
      // Resolve productId correctly (might be object or string)
      const productId = typeof orderToCancel.productId === 'string' ? orderToCancel.productId : orderToCancel.productId._id;
      dispatch(updateProductStock({ productId: productId, change: orderToCancel.quantity }));

      // Return orderId to identify which order was cancelled in the reducer
      return { orderId, updatedOrderData: response }; // Assuming API returns updated order
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to cancel order');
    }
  }
);

// --- Slice Definition ---

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Keep synchronous reducers if needed, e.g., for immediate UI updates
    // like setting sorting, but prefer async thunks for data fetching/manipulation
    setSorting: (state, action: PayloadAction<{ column: OrderState['sorting']['column']; order: 'asc' | 'desc' }>) => {
      state.sorting = action.payload;
    },
    clearOrderError: (state) => {
        state.error = null;
        state.placingOrder = 'idle'; // Reset placing status as well if error was related
    },
    setEmail: (state, action: PayloadAction<string>) => { // Add setEmail reducer
      state.email = action.payload;
    },
    // Potentially add more simple sync reducers if necessary
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        console.log('reached fulfilled' + state.items);
        state.items = action.payload;
        console.log('reached fulfilled2' + state.items);

        state.loading = 'succeeded';
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = 'failed';
      })
      // Place Order
      .addCase(placeOrder.pending, (state) => {
        state.placingOrder = 'pending';
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        // Add the new order to the list (could also re-fetch list)
        if(state.items === undefined) {
            state.items = [];
        }
        state.items.push(action.payload); // Simple push, sorting handled separately
        state.placingOrder = 'succeeded';
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.error = action.payload; // Keep the error object { message, type }
        state.placingOrder = 'failed';
      })
      // Cancel Order
      .addCase(cancelOrder.pending, (state, action) => {
        state.loading = 'pending'; // Set loading state for cancellation
        // Optionally mark the specific order as 'cancelling'
      })
      .addCase(cancelOrder.fulfilled, (state, action: PayloadAction<{ orderId: string; updatedOrderData: Order }>) => {
        const { orderId, updatedOrderData } = action.payload;
        const index = state.items.findIndex(order => order._id === orderId);
        if (index !== -1) {
            state.items[index] = updatedOrderData; // Update the order with the data from the backend
        }
        state.loading = 'succeeded';
        state.error = null; // Clear any previous errors
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        // The payload might be just an error message string or an object with a message
        const errorMessage = typeof action.payload === 'string' ? action.payload :
                             (action.payload as any)?.message || 'Failed to cancel order';
        state.error = { message: errorMessage }; // Store error message
        state.loading = 'failed';
        // Find the order that failed to cancel and potentially revert its state if needed
        // This depends on how you handle pending states in the UI
        // const orderId = action.meta.arg; // Get the order ID from the action meta
        // const orderToRevert = state.items.find(order => order._id === orderId);
        // if (orderToRevert) {
        //   // Revert any optimistic UI updates if necessary
        // }
      });
  },
});

export const {
  setSorting,
  clearOrderError,
  setEmail, // Export setEmail action
  // Removed direct setters like setOrders, addOrder, updateOrderStatus as they are handled by thunks
} = orderSlice.actions;

// Selectors
export const selectOrdersState = (state: RootState) => state.orders;
export const selectAllOrders = (state: RootState) => state.orders.items;
export const selectOrdersLoading = (state: RootState) => state.orders.loading;
export const selectOrdersError = (state: RootState) => state.orders.error;
export const selectOrderSorting = (state: RootState) => state.orders.sorting;
export const selectPlacingOrderStatus = (state: RootState) => state.orders.placingOrder;
export const selectCancelingOrderStatus = (state: RootState, orderId: string) => state.orders.cancelingOrder[orderId] || 'idle';
export const selectOrderEmail = (state: RootState) => state.orders.email; // Add email selector

export default orderSlice.reducer; 