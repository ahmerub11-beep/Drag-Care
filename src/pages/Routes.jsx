import { Link, Routes as RouterRoutes, Route, Navigate, Outlet } from 'react-router-dom';
import Frontend from './Frontend/Home';
import Medicines from './Frontend/Medicines';
import Auth from './Auth';
import Dashboard from './Dashboard';
import { StorefrontProvider } from '../components/ProductCatalog';
import { useAuth } from '../context/AuthContext';
import { hasDashboardAccess } from '../utils/roles';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (adminOnly && !hasDashboardAccess(user.role)) {
    return (
      <div className="container min-vh-100 d-flex flex-column justify-content-center align-items-center text-center">
        <h1 className="h3 fw-bold">Admin access required</h1>
        <p className="text-muted">
          Your account does not have permission to open the dashboard. Contact an administrator if you need access.
        </p>
        <Link to="/" className="btn btn-primary">Return to Store</Link>
      </div>
    );
  }

  return children;
};

const StorefrontLayout = () => (
  <ProtectedRoute>
    <StorefrontProvider>
      <Outlet />
    </StorefrontProvider>
  </ProtectedRoute>
);

const CustomRoutes = () => {
  const { user, token } = useAuth();

  return (
    <RouterRoutes>
      <Route path="/" element={<StorefrontLayout />}>
        <Route index element={<Frontend />} />
        <Route path="medicines" element={<Medicines />} />
        <Route path="frontend/*" element={<Frontend />} />
      </Route>

      <Route
        path="/auth/*"
        element={user && token ? <Navigate to="/" replace /> : <Auth />}
      />

      <Route 
        path="/dashboard/*" 
        element={
          <ProtectedRoute adminOnly>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      {/* Fallback 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </RouterRoutes>
  );
};

export default CustomRoutes;
