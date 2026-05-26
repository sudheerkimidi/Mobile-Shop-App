import { useState } from 'react';
import { searchProducts } from '../api/api';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const QUICK_SEARCHES = [
  'iPhone 13', 'iPhone 14', 'Samsung A12', 'Samsung A52',
  'Redmi Note 10', 'Redmi Note 11', 'OnePlus', 'Vivo Y21'
];

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState({ caseType: '', designStyle: '' });

  const handleSearch = async (q = query) => {
    if (!q.trim()) { toast.error('Please enter a model name'); return; }
    setLoading(true);
    setSearched(true);
    try {
      const params = { q: q.trim() };
      if (filters.caseType) params.caseType = filters.caseType;
      if (filters.designStyle) params.designStyle = filters.designStyle;
      const { data } = await searchProducts(params);
      setResults(data.results);
    } catch {
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = (term) => {
    setQuery(term);
    handleSearch(term);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>Search by Model Name</h1>
      <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 24px' }}>
        Type any phone model name to find matching cases instantly
      </p>

      {/* Search box */}
      <div style={{
        background: 'white', border: '1px solid #e5e7eb',
        borderRadius: 12, padding: 20, marginBottom: 20
      }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <input
            placeholder="Type model name e.g. iPhone 13, Samsung A52..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            style={{
              flex: 1, padding: '12px 16px',
              border: '1.5px solid #6366f1', borderRadius: 8,
              fontSize: 15, outline: 'none'
            }}
            autoFocus
          />
          <button onClick={() => handleSearch()} disabled={loading} style={{
            padding: '12px 24px', background: '#6366f1', color: 'white',
            border: 'none', borderRadius: 8, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer', fontSize: 15,
            minWidth: 100
          }}>
            {loading ? '...' : 'Search'}
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <select value={filters.caseType}
            onChange={e => setFilters({ ...filters, caseType: e.target.value })}
            style={{ padding: '7px 12px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 13, cursor: 'pointer', outline: 'none' }}>
            <option value="">All Case Types</option>
            <option>Flip Cover</option>
            <option>Transparent</option>
            <option>Silicon</option>
            <option>Hard Back</option>
            <option>Leather</option>
          </select>
          <select value={filters.designStyle}
            onChange={e => setFilters({ ...filters, designStyle: e.target.value })}
            style={{ padding: '7px 12px', border: '1px solid #e5e7eb', borderRadius: 7, fontSize: 13, cursor: 'pointer', outline: 'none' }}>
            <option value="">All Designs</option>
            <option>Normal</option>
            <option>Ladies Design</option>
            <option>Premium</option>
            <option>Kids</option>
          </select>
        </div>
      </div>

      {/* Quick search buttons */}
      {!searched && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 10 }}>Quick searches:</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {QUICK_SEARCHES.map(term => (
              <button key={term} onClick={() => handleQuickSearch(term)} style={{
                padding: '7px 14px', border: '1px solid #e5e7eb', borderRadius: 20,
                background: 'white', fontSize: 13, cursor: 'pointer',
                color: '#374151', transition: 'all 0.15s'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151'; }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 36 }}>🔍</div>
          <p style={{ color: '#6b7280', marginTop: 8 }}>Searching...</p>
        </div>
      )}

      {!loading && searched && (
        <div>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
            {results.length > 0
              ? `Found ${results.length} product${results.length > 1 ? 's' : ''} for "${query}"`
              : `No results for "${query}"`}
          </p>

          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, background: 'white', borderRadius: 12, border: '1px dashed #e5e7eb' }}>
              <div style={{ fontSize: 48 }}>😔</div>
              <h3 style={{ color: '#374151' }}>No matching cases found</h3>
              <p style={{ color: '#9ca3af', fontSize: 14 }}>
                Try a different model name or check spelling
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16 }}>
              {results.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
