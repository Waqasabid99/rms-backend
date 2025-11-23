import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './store/authStore';

import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import UserManagement from './pages/UserManagement';
import Reservations from './pages/Reservations';

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
      <p className="text-gray-600">You don't have permission to access this page.</p>
    </div>
  </div>
);

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/staff/dashboard'} />}
        />

        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/staff/dashboard'} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reservations"
          element={
            <ProtectedRoute requiredRole="admin">
              <Reservations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/takeaway"
          element={
            <ProtectedRoute requiredRole="admin">
              <div>Takeaway Orders - Admin</div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/delivery"
          element={
            <ProtectedRoute requiredRole="admin">
              <div>Delivery Orders - Admin</div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute requiredRole="admin">
              <div>Profile Settings</div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute requiredRole="staff">
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/reservations"
          element={
            <ProtectedRoute requiredRole="staff">
              <Reservations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/takeaway"
          element={
            <ProtectedRoute requiredRole="staff">
              <div>Takeaway Orders - Staff</div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/delivery"
          element={
            <ProtectedRoute requiredRole="staff">
              <div>Delivery Orders - Staff</div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/profile"
          element={
            <ProtectedRoute requiredRole="staff">
              <div>Profile Settings</div>
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
