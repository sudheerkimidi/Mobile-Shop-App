import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login(form);
      loginUser(data.user, data.token);
      toast.success(`Welcome, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{
        background: 'white', borderRadius: 16, padding: 40,
        width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>📱</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>ShopManager</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: 14 }}>Sign in to your shop account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
              Email Address
            </label>
            <input
              type="email" placeholder="you@example.com" required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb',
                borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password" placeholder="Enter your password" required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb',
                borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none'
              }}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px', background: loading ? '#a5b4fc' : '#6366f1',
            color: 'white', border: 'none', borderRadius: 8,
            fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer'
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
          New shop?{' '}
          <Link to="/register" style={{ color: '#6366f1', fontWeight: 500, textDecoration: 'none' }}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
