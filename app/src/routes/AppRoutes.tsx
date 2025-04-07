import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import OrdersListPage from '../pages/OrdersListPage';
import NavigationBar from '../components/NavigationBar';

const AppRoutes: React.FC = () => {
  return (
    <>
      <NavigationBar />
      <div className="container mx-auto p-4"> {/* Optional: Add some layout padding */}
        <Routes>
          {/* Default route redirects to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/orders" element={<OrdersListPage />} />

          {/* Keep existing auth routes if needed */}
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> */}

          {/* Optional: Catch-all route for 404 Not Found */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </>
  );
};

export default AppRoutes; 