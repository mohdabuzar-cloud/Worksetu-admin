import type { ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { MainLayout } from './components/Layout';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import ServiceManagement from './pages/ServiceManagement';
import UserManagement from './pages/UserManagement';
import WorkerManagement from './pages/WorkerManagement';
import KYCVerification from './pages/KYCVerification';
import BookingManagement from './pages/BookingManagement';
import ManualAssignment from './pages/ManualAssignment';
import DisputeSupport from './pages/DisputeSupport';
import FinancePayouts from './pages/FinancePayouts';
import ReportsAnalytics from './pages/ReportsAnalytics';
import PlatformSettings from './pages/PlatformSettings';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuth = localStorage.getItem('ws_auth') === 'true';
  if (!isAuth) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: AdminLogin,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', Component: Dashboard },
      { path: 'services', Component: ServiceManagement },
      { path: 'users', Component: UserManagement },
      { path: 'workers', Component: WorkerManagement },
      { path: 'kyc', Component: KYCVerification },
      { path: 'bookings', Component: BookingManagement },
      { path: 'assignment', Component: ManualAssignment },
      { path: 'disputes', Component: DisputeSupport },
      { path: 'finance', Component: FinancePayouts },
      { path: 'reports', Component: ReportsAnalytics },
      { path: 'settings', Component: PlatformSettings },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
]);