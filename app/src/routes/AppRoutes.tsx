import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Page components (create these later)
// import DashboardPage from '../pages/DashboardPage';
// import OrderDetailPage from '../pages/OrderDetailPage';
// import OrdersListPage from '../pages/OrdersListPage';

const AppRoutes: React.FC = () => {
  // Placeholder components until pages are created
  const DashboardPage = () => <div>Dashboard Page (To be implemented)</div>;
  const OrderDetailPage = () => <div>Order Detail Page (To be implemented)</div>;
  const OrdersListPage = () => <div>Orders List Page (To be implemented)</div>;

  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/order/:productId" element={<OrderDetailPage />} />
      <Route path="/orders" element={<OrdersListPage />} />
      {/* Default route redirects to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes; 