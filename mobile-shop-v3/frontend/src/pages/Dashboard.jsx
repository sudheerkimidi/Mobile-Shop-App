import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getStats } from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, outOfStock: 0, lowStock: 0 });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, statsRes] = await Promise.allSettled([
        getProducts(1),
        getStats()
      ]);
      if (productsRes.status === 'fulfilled') {
        setRecentProducts(productsRes.value.data.products.slice(0, 6));
      }
      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data);
      }
    } catch (err) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Products', value: stats.total, icon: '📦', color: '#ede9fe', text: '#5b21b6' },
    { label: 'Out of Stock', value: stats.outOfStock, icon: '⚠️', color: '#fee2e2', text: '#991b1b' },
    { label: 'Low Stock (≤5)', value: stats.lowStock, icon: '📉', color: '#fef9c3', text: '#854d0e' },
    { label: 'Available', value: stats.total - stats.outOfStock, icon: '✅', color: '#dcfce7', text: '#166534' }
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>
      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>
          Welcome back, {user?.name} 👋
        </h1>
        <p style={{ color: '#6b7280', margin: '4px 0 0', fontSize: 14 }}>
          {user?.shopName} · {user?.shopLocation}
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {statCards.map(card => (
          <div key={card.label} style={{
            background: 'white', border: '1px solid #e5e7eb',
            borderRadius: 12, padding: '20px 24px'
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{card.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>{loading ? '—' : card.value}</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/add-product" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '10px 20px', background: '#6366f1', color: 'white',
              border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14
            }}>
              + Add Product
            </button>
          </Link>
          <Link to="/search" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '10px 20px', background: 'white', color: '#6366f1',
              border: '1.5px solid #6366f1', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14
            }}>
              🔍 Search by Model
            </button>
          </Link>
          <Link to="/visual-search" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '10px 20px', background: 'white', color: '#7c3aed',
              border: '1.5px solid #7c3aed', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14
            }}>
              📷 Visual Search
            </button>
          </Link>
          <Link to="/inventory" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '10px 20px', background: 'white', color: '#374151',
              border: '1.5px solid #e5e7eb', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14
            }}>
              📋 View Inventory
            </button>
          </Link>
        </div>
      </div>

      {/* Recent products */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>Recently Added</h2>
          <Link to="/inventory" style={{ fontSize: 13, color: '#6366f1', textDecoration: 'none' }}>View all →</Link>
        </div>

        {loading ? (
          <p style={{ color: '#9ca3af' }}>Loading...</p>
        ) : recentProducts.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 20px',
            background: 'white', borderRadius: 12, border: '1px dashed #e5e7eb'
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
            <p style={{ color: '#6b7280', margin: 0 }}>No products yet.</p>
            <Link to="/add-product">
              <button style={{
                marginTop: 12, padding: '10px 20px', background: '#6366f1',
                color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600
              }}>
                Add Your First Product
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {recentProducts.map(p => (
              <div key={p._id} style={{
                background: 'white', border: '1px solid #e5e7eb',
                borderRadius: 10, overflow: 'hidden'
              }}>
                <div style={{ height: 100, background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.images?.[0] ? (
                    <img src={p.images[0].url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : <span style={{ fontSize: 32 }}>📱</span>}
                </div>
                <div style={{ padding: '8px 10px' }}>
                  <p style={{ fontSize: 12, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: '#6b7280', margin: '2px 0 0' }}>{p.deviceModel}</p>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', margin: '4px 0 0' }}>₹{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
