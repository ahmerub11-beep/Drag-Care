import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Pill,
  RefreshCw,
  ShoppingBag,
  Users
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddMedicine, setShowAddMedicine] = useState(false);

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/medicines', label: 'Medicines', icon: Package },
    { to: '/dashboard/prescriptions', label: 'Prescriptions', icon: FileText },
    { to: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
    ...(isSuperAdmin
      ? [{ to: '/dashboard/users', label: 'User Management', icon: Users }]
      : [])
  ];

  const pageTitle = isSuperAdmin ? 'Super Admin Portal' : 'Pharmacy Admin Portal';

  return (
    <div className="dashboard-shell bg-light min-vh-100">
      <nav className="dashboard-navbar navbar navbar-expand-lg navbar-dark bg-dark px-3 px-lg-4 shadow-sm">
        <div className="container-fluid p-0">
          <div className="dashboard-brand d-flex align-items-center gap-2">
            <span className="p-2 rounded-3 bg-primary text-white d-inline-flex">
              <Pill size={20} />
            </span>
            <Link to="/" className="text-decoration-none">
              <span className="navbar-brand fw-bold m-0 fs-5">
                Drag<span className="text-primary">Care</span> Management
              </span>
            </Link>
            <span className={`badge ${isSuperAdmin ? 'bg-danger' : 'bg-primary'} text-uppercase px-2 py-1 ms-2`}>
              {isSuperAdmin ? 'Super Admin' : 'Pharmacy Admin'}
            </span>
          </div>

          <div className="dashboard-account-actions d-flex align-items-center gap-3">
            <span className="text-light small d-none d-md-inline">
              Welcome, <strong>{user?.name || 'Administrator'}</strong>
            </span>
            <Link to="/" className="btn btn-outline-light btn-sm rounded-pill d-flex align-items-center gap-1">
              <ArrowLeft size={14} />
              <span>Back to Store</span>
            </Link>
            <button
              className="btn btn-danger btn-sm rounded-pill d-flex align-items-center gap-1"
              onClick={() => {
                logout();
                navigate('/auth/login');
              }}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="dashboard-main container py-4">
        <div className="dashboard-heading d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-dark m-0">{pageTitle}</h2>
            <p className="text-muted small m-0">
              Monitor orders, manage medicine inventory, review prescriptions and user access
            </p>
          </div>
          <div className="dashboard-page-actions d-flex gap-2">
            <button
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1 rounded-pill"
              onClick={() => setRefreshKey((key) => key + 1)}
            >
              <RefreshCw size={14} />
              <span>Refresh Data</span>
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm d-flex align-items-center gap-1 rounded-pill fw-semibold shadow-sm"
              onClick={() => {
                setShowAddMedicine(true);
                navigate('/dashboard/medicines');
              }}
            >
              <Package size={16} />
              <span>Add New Medicine</span>
            </button>
          </div>
        </div>

        <nav className="dashboard-navigation card shadow-sm border-0 rounded-3 mb-4" aria-label="Dashboard">
          <div className="card-body p-2">
            <ul className="dashboard-nav-list nav nav-pills gap-1">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <li className="nav-item" key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) => `nav-link rounded-pill px-3 py-2 small fw-semibold d-flex align-items-center gap-2 ${
                      isActive ? `active ${to.endsWith('/users') ? 'bg-danger' : 'bg-primary'}` : 'text-dark'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <Outlet context={{ refreshKey, showAddMedicine, setShowAddMedicine }} />
      </main>
    </div>
  );
}
