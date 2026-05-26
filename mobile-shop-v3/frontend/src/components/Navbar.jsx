import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    padding: '6px 14px',
    borderRadius: 6,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    background: isActive(path) ? '#6366f1' : 'transparent',
    color: isActive(path) ? 'white' : '#4b5563'
  });

  if (!user) return null;

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '0 24px',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Left: Logo */}
      <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 20 }}>📱</span>
        <span style={{ fontWeight: 700, fontSize: 16, color: '#6366f1' }}>ShopManager</span>
      </Link>

      {/* Center: Nav links */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
        <Link to="/inventory" style={linkStyle('/inventory')}>Inventory</Link>
        <Link to="/search" style={linkStyle('/search')}>Search</Link>
        <Link to="/visual-search" style={linkStyle('/visual-search')}>📷 Visual</Link>
        {user.role === 'admin' && (
          <Link to="/admin" style={linkStyle('/admin')}>Admin</Link>
        )}
      </div>

      {/* Right: User info + logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: '#6b7280' }}>
          {user.shopName}
        </span>
        <button
          onClick={handleLogout}
          style={{
            padding: '6px 14px', border: '1px solid #e5e7eb',
            borderRadius: 6, background: 'white', cursor: 'pointer',
            fontSize: 13, color: '#6b7280'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
