import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import HomePage from '../pages/HomePage/HomePage';
import ProductPage from '../pages/ProductPage/ProductPage';
import LoginPage from '../pages/auth/LoginPage/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage/RegisterPage';
import CheckoutPage from '../pages/CheckoutPage/CheckoutPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import AdminLayout from '../pages/admin/AdminLayout/AdminLayout';
import CategoriesPage from '../pages/admin/CategoriesPage/CategoriesPage';
import ProductsPage from '../pages/admin/ProductsPage/ProductsPage';
import OrdersPage from '../pages/admin/OrdersPage/OrdersPage';
import NotFound from '../pages/NotFound/NotFound';
import ProductForm from '../pages/admin/ProductForm/ProductForm';
import CategoryForm from "../pages/admin/CategoryForm/CategoryForm";
import OrdersProfilePage from '../pages/OrdersProfilePage/OrdersProfilePage';

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div>Завантаження...</div>;
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="products/:id" element={<ProductPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        <Route path="checkout" element={
          <CheckoutPage />
        } />
        
        <Route path="profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />

        <Route path="orders" element={
          <ProtectedRoute>
            <OrdersProfilePage />
          </ProtectedRoute>
        } />
        
        <Route path="admin" element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/products" replace />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="orders" element={<OrdersPage />} />

          <Route path="/admin/products/create" element={<ProductForm />} />
          <Route path="/admin/products/edit/:id" element={<ProductForm />} />

          <Route path="/admin/categories/create" element={<CategoryForm />} />
          <Route path="/admin/categories/edit/:id" element={<CategoryForm />} />
        </Route>
        <Route path='*' element={<NotFound/>} />
      </Route>
    </Routes>
  );
}

export default AppRouter;