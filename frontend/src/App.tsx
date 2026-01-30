import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './login/AuthContext';
import Layout from './shared/components/Layout';
import Login from './login/Login';
import Register from './login/Register';
import ForgotPassword from './login/ForgotPassword';
import Home from './dashboard/Home';
import LostItems from './dashboard/LostItems';
import CreateLostItem from './dashboard/CreateLostItem';
import FoundItems from './dashboard/FoundItems';
import CreateFoundItem from './dashboard/CreateFoundItem';
import AdminDashboard from './admin/AdminDashboard';
import ProtectedRoute from './login/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes - User */}
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/lost-items" element={<LostItems />} />
              <Route path="/create-lost" element={<CreateLostItem />} />
              <Route path="/found-items" element={<FoundItems />} />
              <Route path="/create-found" element={<CreateFoundItem />} />
            </Route>

            {/* Protected Routes - Admin */}
            <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
