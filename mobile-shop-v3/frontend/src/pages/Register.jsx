import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/api';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', shopName: '', shopLocation: '', phone: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await register(form);
      toast.success(data.message);
      if (data.isAdmin) {
        navigate('/login');
      } else {
        toast('Please wait for admin approval before logging in.', { icon: 'ℹ️' });
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb',
    borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none', marginBottom: 14
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{
        background: 'white', borderRadius: 16, padding: 40,
        width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🏪</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Create Shop Account</h1>
          <p style={{ color: '#6b7280', fontSize: 13, margin: '4px 0 0' }}>
            First account created becomes admin automatically
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>Your Name *</label>
          <input placeholder="Full name" required style={inputStyle}
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

          <label style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>Email *</label>
          <input type="email" placeholder="email@example.com" required style={inputStyle}
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />

          <label style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>Password * (min 6 characters)</label>
          <input type="password" placeholder="Choose a strong password" required style={inputStyle}
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />

          <label style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>Shop Name *</label>
          <input placeholder="e.g. Raja Mobile Shop" required style={inputStyle}
            value={form.shopName} onChange={e => setForm({ ...form, shopName: e.target.value })} />

          <label style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>Shop Location</label>
          <input placeholder="e.g. Main Road, Vijayawada" style={inputStyle}
            value={form.shopLocation} onChange={e => setForm({ ...form, shopLocation: e.target.value })} />

          <label style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>Phone Number</label>
          <input placeholder="9999999999" style={{ ...inputStyle, marginBottom: 20 }}
            value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px', background: loading ? '#a5b4fc' : '#6366f1',
            color: 'white', border: 'none', borderRadius: 8,
            fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer'
          }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#6b7280' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6366f1', fontWeight: 500, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
