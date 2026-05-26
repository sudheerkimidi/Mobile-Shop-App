import { useState, useEffect } from 'react';
import { getPendingUsers, approveUser } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const { data } = await getPendingUsers();
      setPending(data.users);
    } catch {
      toast.error('Failed to load pending users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, name) => {
    try {
      await approveUser(id);
      setPending(prev => prev.filter(u => u._id !== id));
      toast.success(`${name} approved!`);
    } catch {
      toast.error('Approval failed');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 20px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>Admin Panel</h1>
      <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 28px' }}>
        Approve shop owner registrations
      </p>

      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>
            Pending Approvals ({pending.length})
          </h2>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>Loading...</div>
        ) : pending.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 40 }}>✅</div>
            <p style={{ color: '#6b7280', margin: '8px 0 0' }}>No pending approvals</p>
          </div>
        ) : (
          pending.map((u, i) => (
            <div key={u._id} style={{
              padding: '16px 20px',
              borderBottom: i < pending.length - 1 ? '1px solid #f3f4f6' : 'none',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: 12
            }}>
              <div>
                <p style={{ fontWeight: 600, margin: '0 0 2px', color: '#111827' }}>{u.name}</p>
                <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 2px' }}>{u.email}</p>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                  🏪 {u.shopName} · 📍 {u.shopLocation || 'No location'}
                </p>
              </div>
              <button onClick={() => handleApprove(u._id, u.name)} style={{
                padding: '8px 20px', background: '#22c55e', color: 'white',
                border: 'none', borderRadius: 7, cursor: 'pointer',
                fontWeight: 600, fontSize: 13
              }}>
                ✓ Approve
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
