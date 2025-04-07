# Product Ordering Dashboard Implementation Plan

**Backend Setup (Express & MongoDB)**

- [x] `server/src/models/Product.ts`: Define the Mongoose schema for the `products` collection (fields: `name`, `price`, `stock`, `category`).
- [x] `server/src/models/Order.ts`: Define the Mongoose schema for the `orders` collection (fields: `productId` (ref: 'Product'), `quantity`, `emailId`, `deliveryDate`, `status` (e.g., 'Confirmed', 'Canceled'), `orderDate`).
- [x] `server`: Create a script or utility function to seed the `products` collection with at least 15 items, including some with `stock: 0`. Run this script once.
- [x] `server/src/server.ts`: Ensure basic Express server setup, including CORS and body-parser middleware.
- [x] `server/src/routes/index.ts`: Set up main router to delegate to product and order routes.
- [x] `server/src/routes/productRoutes.ts`: Create router file for product-related endpoints.
- [x] `server/src/routes/orderRoutes.ts`: Create router file for order-related endpoints.

**Products API Implementation**

- [x] `server/src/daos/productDao.ts`: Implement basic DAO function to find all products.
- [x] `server/src/services/productService.ts`: Implement service function calling the DAO to get all products.
- [x] `server/src/controllers/productController.ts`: Implement controller function for `GET /products` (basic fetch).
- [x] `server/src/routes/productRoutes.ts`: Define the `GET /products` route and link it to the controller.
- [x] `server/src/daos/productDao.ts`: Enhance DAO function to handle filtering by `category` and `price` (`$gte`, `$lte`).
- [x] `server/src/daos/productDao.ts`: Enhance DAO function to handle sorting by `name`, `price`, `stock` (`asc`/`desc`).
- [x] `server/src/services/productService.ts` & `server/src/controllers/productController.ts`: Update service and controller to parse query parameters (`category`, `price_gte`, `price_lte`, `sort`, `order`) and pass them to the DAO.
- [x] `server/src/daos/productDao.ts`: Implement DAO function to find a product by its ID.

**Orders API Implementation**

- [x] `server/src/daos/orderDao.ts`: Implement basic DAO function to create an order.
- [x] `server/src/services/orderService.ts`: Implement `placeOrder` service function structure. Include input validation (check for required fields).
- [x] `server/src/services/orderService.ts`: Inside `placeOrder`, add logic to fetch the product and check if `requested quantity <= available stock`. Return an error if insufficient.
- [x] `server/src/services/orderService.ts`: Implement MongoDB transaction logic within `placeOrder` to atomically create the order document and decrement the product's stock using `productDao`.
- [x] `server/src/controllers/orderController.ts`: Implement controller function for `POST /orders`, calling the `placeOrder` service.
- [x] `server/src/routes/orderRoutes.ts`: Define the `POST /orders` route.
- [x] `server/src/daos/orderDao.ts`: Implement DAO function to find all orders, potentially populating product details. Add sorting capabilities based on query parameters.
- [x] `server/src/controllers/orderController.ts`: Implement controller function for `GET /orders`.
- [x] `server/src/routes/orderRoutes.ts`: Define the `GET /orders` route.
- [x] `server/src/services/orderService.ts`: Implement `cancelOrder` service function. Include logic to fetch the order by ID.
- [x] `server/src/services/orderService.ts`: Inside `cancelOrder`, add logic to check if `deliveryDate` is more than 5 days from the current date. Return an error if not allowed.
- [x] `server/src/services/orderService.ts`: Implement MongoDB transaction logic within `cancelOrder` to atomically update the order status to 'Canceled' and restore the product's stock using `productDao`.
- [x] `server/src/controllers/orderController.ts`: Implement controller function for `PUT /orders/cancel/:id`.
- [x] `server/src/routes/orderRoutes.ts`: Define the `PUT /orders/cancel/:id` route.

**Frontend Setup (React & Redux)**

- [x] `app`: Install frontend dependencies: `react-router-dom`, `@reduxjs/toolkit`, `react-redux`, `redux-persist`
- [x] `app/src/store`: Set up Redux store using `configureStore`.
- [x] `app/src/store/slices/productSlice.ts`: Create a Redux slice for managing products state (list, loading, error, filters, sorting).
- [x] `app/src/store/slices/orderSlice.ts`: Create a Redux slice for managing orders state (list, loading, error, sorting).
- [x] `app/src/store`: Configure `redux-persist` to save relevant parts of the state (like filters, potentially orders/products if desired for offline view) to Local Storage.
- [x] `app/src/routes/AppRoutes.tsx` (or similar): Define routes for `/dashboard`, `/order/:productId`, `/orders`. Make `/dashboard` the default route shown.
- [x] `app/src/components/NavigationBar.tsx`: Create a navigation component with links to Dashboard (`/dashboard`) and Orders (`/orders`). Integrate it into `App.tsx`.

**Frontend Implementation - Pages & Components**

- [x] `app/src/features/products/components/ProductTable.tsx`: Create a reusable table component to display products with sortable columns. It should accept product data and sorting state/handlers as props. Indicate/disable ordering for zero-stock items.
- [x] `app/src/features/products/components/ProductFilter.tsx`: Create a component with a category dropdown and min/max price inputs. It should dispatch Redux actions to update filter state.
- [x] `app/src/pages/DashboardPage.tsx`: Implement the main dashboard page. Fetch products using a Redux thunk/async action based on current filter/sort state. Display `ProductFilter` and `ProductTable`. Handle navigation to the detail page on row click.
- [x] `app/src/pages/OrderDetailPage.tsx`: Implement the order detail page. Fetch product details based on the `productId` route parameter. Display product info.
- [x] `app/src/features/orders/components/OrderForm.tsx`: Create the order form component within `OrderDetailPage` (quantity, email, delivery date picker). Add validation.
- [x] `app/src/pages/OrderDetailPage.tsx`: Handle form submission: dispatch a Redux thunk/async action to call the `POST /orders` API. On success, redirect to the `/orders` page and potentially refresh product stock data.
- [x] `app/src/features/orders/components/OrderTable.tsx`: Create a reusable table component to display orders with sortable columns (including email). Accept order data and sorting state/handlers as props.
- [x] `app/src/features/orders/components/CancelOrderButton.tsx`: Create a button component within `OrderTable` rows. It should only be visible if the delivery date condition is met. On click, it dispatches a thunk/action to call `PUT /orders/cancel/:id`.
- [x] `app/src/pages/OrdersListPage.tsx`: Implement the orders list page. Fetch all orders using a Redux thunk/async action based on sorting state. Display the `OrderTable`.
- [x] `app/src/services/api.ts`: Implement API service functions (e.g., using Axios) to interact with all backend endpoints (`getProducts`, `getProductById`, `postOrder`, `getOrders`, `cancelOrder`).
- [ ] `app` & `server`: Perform end-to-end testing, refine UI styling, ensure validation messages are displayed correctly, and verify transaction integrity. Check console for errors. 