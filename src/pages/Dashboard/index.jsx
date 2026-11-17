import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import OverviewTab from './OverviewTab';
import MedicinesTab from './MedicinesTab';
import PrescriptionsTab from './PrescriptionsTab';
import OrdersTab from './OrdersTab';
import UsersTab from './UsersTab';

export default function Dashboard() {
  const { isSuperAdmin } = useAuth();

  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<OverviewTab />} />
        <Route path="medicines" element={<MedicinesTab />} />
        <Route path="prescriptions" element={<PrescriptionsTab />} />
        <Route path="orders" element={<OrdersTab />} />
        {isSuperAdmin && <Route path="users" element={<UsersTab />} />}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
