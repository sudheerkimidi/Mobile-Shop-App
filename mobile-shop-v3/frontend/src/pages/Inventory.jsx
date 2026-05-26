import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, searchProducts } from '../api/api';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ caseType: '', designStyle: '' });
  const [total, setTotal] = useState(0);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Debounce search — wait 400ms after user stops typing
  useEffect(() => {
    if (searchQuery.trim().length === 0 && !filters.caseType && !filters.designStyle) {
      fetchAllProducts();
      return;
    }
    const timer = setTimeout(() => handleSearch(), 400);
    return () => clearTimeout(timer);
  }, [searchQuery, filters]);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const { data } = await getProducts(1);
      setProducts(data.products);
      setTotal(data.total);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setSearching(true);
    try {
      const params = {};
      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (filters.caseType) params.caseType = filters.caseType;
      if (filters.designStyle) params.designStyle = filters.designStyle;

      const { data } = await searchProducts(params);
      setProducts(data.results);
      setTotal(data.count);
    } catch {
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleDelete = (deletedId) => {
    setProducts(prev => prev.filter(p => p._id !== deletedId));
    setTotal(prev => prev - 1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({ caseType: '', designStyle: '' });
    fetchAllProducts();
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Inventory</h1>
          <p style={{ color: '#6b7280', fontSize: 13, margin: '4px 0 0' }}>
            {total} products total
          </p>
        </div>
        <Link to="/add-product" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '10px 20px', background: '#6366f1', color: 'white',
            border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14
          }}>
            + Add Product
          </button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div style={{
        background: 'white', border: '1px solid #e5e7eb',
        borderRadius: 12, padding: 16, marginBottom: 24
      }}>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
          <input
            placeholder="Search by model name e.g. iPhone 13, Samsung A12, Redmi Note 10..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '11px 14px 11px 42px',
              border: '1.5px solid #e5e7eb', borderRadius: 8,
              fontSize: 14, boxSizing: 'border-box', outline: 'none'
            }}
          />
          {searching && (
            <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#6b7280' }}>
              Searching...
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={filters.caseType}
            onChange={e => setFilters({ ...filters, caseType: e.target.value })}
            style={{
              padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 7,
              fontSize: 13, cursor: 'pointer', background: 'white', outline: 'none'
            }}
          >
            <option value="">All Types</option>
            <option>Flip Cover</option>
            <option>Transparent</option>
            <option>Silicon</option>
            <option>Hard Back</option>
            <option>Leather</option>
            <option>Wallet Case</option>
            <option>Ring Case</option>
          </select>

          <select
            value={filters.designStyle}
            onChange={e => setFilters({ ...filters, designStyle: e.target.value })}
            style={{
              padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 7,
              fontSize: 13, cursor: 'pointer', background: 'white', outline: 'none'
            }}
          >
            <option value="">All Styles</option>
            <option>Normal</option>
            <option>Ladies Design</option>
            <option>Premium</option>
            <option>Kids</option>
            <option>Sports</option>
            <option>Printed</option>
          </select>

          {(searchQuery || filters.caseType || filters.designStyle) && (
            <button onClick={clearFilters} style={{
              padding: '8px 14px', border: '1px solid #e5e7eb', borderRadius: 7,
              background: 'white', color: '#6b7280', fontSize: 13, cursor: 'pointer'
            }}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Products grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 40 }}>⏳</div>
          <p style={{ color: '#6b7280', marginTop: 8 }}>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: 'white', borderRadius: 12, border: '1px dashed #e5e7eb'
        }}>
          <div style={{ fontSize: 48 }}>🔍</div>
          <h3 style={{ color: '#374151', margin: '12px 0 4px' }}>No products found</h3>
          <p style={{ color: '#9ca3af', margin: 0, fontSize: 14 }}>
            {searchQuery ? `No results for "${searchQuery}"` : 'Add your first product'}
          </p>
          {!searchQuery && (
            <Link to="/add-product">
              <button style={{
                marginTop: 16, padding: '10px 24px', background: '#6366f1',
                color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600
              }}>
                + Add Product
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16 }}>
          {products.map(product => (
            <ProductCard key={product._id} product={product} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
