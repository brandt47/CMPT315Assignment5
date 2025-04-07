import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'; // Use environment variable or default

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Product API ---

export interface ProductQueryParams {
  category?: string | null;
  price_gte?: number | null;
  price_lte?: number | null;
  sort?: string | null; // Corresponds to keyof Product
  order?: 'asc' | 'desc' | null;
}

export const getProducts = (params: ProductQueryParams = {}) => {
  // Clean up null/undefined params before sending
  const cleanParams = Object.entries(params)
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  return apiClient.get('/products', { params: cleanParams });
};

export const getProductById = (productId: string) => {
  // Assuming the backend uses GET /products/:id or similar
  // If not, adjust or use getProducts with filtering if backend only supports that
  // For now, let's assume there might be a specific endpoint or that getProducts is sufficient
  // This might need refinement based on the exact backend implementation
   return apiClient.get(`/products/${productId}`); // Adjust if endpoint differs
};


// --- Order API ---

export interface PlaceOrderPayload {
  productId: string;
  quantity: number;
  emailId: string;
  deliveryDate: string; // Ensure format matches backend expectation (e.g., ISO string)
}

export interface OrderQueryParams {
    sort?: string | null; // Corresponds to keyof Order
    order?: 'asc' | 'desc' | null;
}


export const placeOrder = (payload: PlaceOrderPayload) => {
  return apiClient.post('/orders', payload);
};

export const getOrders = (params: OrderQueryParams = {}) => {
    // Clean up null/undefined params before sending
    const cleanParams = Object.entries(params)
      .filter(([, value]) => value !== null && value !== undefined && value !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    return apiClient.get('/orders', { params: cleanParams });
};

export const cancelOrder = (orderId: string) => {
  return apiClient.put(`/orders/cancel/${orderId}`);
}; 