import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import ProductFormPage from './pages/ProductFormPage';
import CategoriesPage from './pages/CategoriesPage';
import SuppliersPage from './pages/SuppliersPage';
import SupplierFormPage from './pages/SupplierFormPage';
import CustomersPage from './pages/CustomersPage';
import CustomerFormPage from './pages/CustomerFormPage';
import PurchasesPage from './pages/PurchasesPage';
import PurchaseCreatePage from './pages/PurchaseCreatePage';
import PurchaseDetailPage from './pages/PurchaseDetailPage';
import OrdersPage from './pages/OrdersPage';
import OrderCreatePage from './pages/OrderCreatePage';
import OrderDetailPage from './pages/OrderDetailPage';
import StockPage from './pages/StockPage';
import PaymentsPage from './pages/PaymentsPage';

/**
 * ACADEMIC PURPOSE:
 * The App component serves as the root router for the React application.
 * It maps URLs to specific page components.
 * 
 * ROUTING SETUP:
 * - We use 'react-router-dom' to enable client-side routing.
 * - ProtectedRoute acts as an interceptor. If a user is not authenticated,
 *   they are redirected to the Login page, preventing unauthorized access.
 */

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:id/edit" element={<ProductFormPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="suppliers/new" element={<SupplierFormPage />} />
          <Route path="suppliers/:id/edit" element={<SupplierFormPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/new" element={<CustomerFormPage />} />
          <Route path="customers/:id/edit" element={<CustomerFormPage />} />
          <Route path="purchases" element={<PurchasesPage />} />
          <Route path="purchases/new" element={<PurchaseCreatePage />} />
          <Route path="purchases/:id" element={<PurchaseDetailPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/new" element={<OrderCreatePage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="stock" element={<StockPage />} />
          <Route path="payments" element={<PaymentsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
