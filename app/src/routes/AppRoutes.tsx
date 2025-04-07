import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../../features/authentication/pages/LoginPage';
import RegisterPage from '../../features/authentication/pages/RegisterPage';
// Import the new pages
import DashboardPage from '../../pages/DashboardPage';
import OrderDetailPage from '../../pages/OrderDetailPage';
import OrdersListPage from '../../pages/OrdersListPage';

const AppRoutes: React.FC = () => {
  // Placeholder components until pages are created
  const DashboardPage = () => <div>Dashboard Page (To be implemented)</div>;
  const OrderDetailPage = () => <div>Order Detail Page (To be implemented)</div>;
  const OrdersListPage = () => <div>Orders List Page (To be implemented)</div>;

  return (
    <Routes>
      {/* Default route redirects to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/order/:productId" element={<OrderDetailPage />} />
      <Route path="/orders" element={<OrdersListPage />} />

      {/* Keep existing auth routes if needed */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Optional: Catch-all route for 404 Not Found */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes; 