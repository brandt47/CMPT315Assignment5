const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'; // Use environment variable or default

// Helper function to handle fetch responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  // Check if response has content before trying to parse JSON
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
      return response.json();
  } else {
      // Handle non-JSON responses, e.g., empty body for PUT/DELETE
      return {}; // Or return null, or text, depending on expectations
  }
};

// Helper function to construct URL with query parameters
const buildUrlWithParams = (baseUrl: string, params: Record<string, any>) => {
    const url = new URL(baseUrl, API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`);
    // Clean up null/undefined/empty string params before sending
    Object.entries(params)
        .filter(([, value]) => value !== null && value !== undefined && value !== '')
        .forEach(([key, value]) => url.searchParams.append(key, String(value)));
    return url.toString();
};

// --- Product API ---

export interface ProductQueryParams {
  category?: string | null;
  price_gte?: number | null;
  price_lte?: number | null;
  sort?: string | null; // Corresponds to keyof Product
  order?: 'asc' | 'desc' | null;
}

export const getProducts = (params: ProductQueryParams = {}) => {
  const url = buildUrlWithParams('/products', params);
  return fetch(url).then(handleResponse);
};

export const getProductById = (productId: string) => {
  const url = `${API_BASE_URL}/products/${productId}`;
  return fetch(url).then(handleResponse);
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
  const url = `${API_BASE_URL}/orders`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }).then(handleResponse);
};

export const getOrders = (params: OrderQueryParams = {}) => {
    const url = buildUrlWithParams('/orders', params);
    return fetch(url).then(handleResponse);
};

export const cancelOrder = (orderId: string) => {
  const url = `${API_BASE_URL}/orders/cancel/${orderId}`;
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json', // Include header even if body is empty, some backends might require it
    },
    // No body needed for this PUT request typically
  }).then(handleResponse);
}; 