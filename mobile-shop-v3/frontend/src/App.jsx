import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Search from './pages/Search';
import VisualSearch from './pages/VisualSearch';
import Admin from './pages/Admin';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
      <Route path="/inventory" element={<PrivateRoute><Layout><Inventory /></Layout></PrivateRoute>} />
      <Route path="/add-product" element={<PrivateRoute><Layout><AddProduct /></Layout></PrivateRoute>} />
      <Route path="/edit-product/:id" element={<PrivateRoute><Layout><EditProduct /></Layout></PrivateRoute>} />
      <Route path="/search" element={<PrivateRoute><Layout><Search /></Layout></PrivateRoute>} />
      <Route path="/visual-search" element={<PrivateRoute><Layout><VisualSearch /></Layout></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute><Layout><Admin /></Layout></PrivateRoute>} />
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right"
          toastOptions={{ duration: 4000, style: { fontSize: 14, borderRadius: 8 } }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
