import { useState } from 'react';
import { visualSearch, regenerateEmbeddings } from '../api/api';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

export default function VisualSearch() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [regen, setRegen] = useState(false);
  const [searched, setSearched] = useState(false);
  const [info, setInfo] = useState({ message: '', method: '' });

  const handleSelect = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10*1024*1024) { toast.error('Max 10MB'); return; }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResults([]); setSearched(false);
  };

  const handleDrop = e => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      setImage(file); setPreview(URL.createObjectURL(file));
      setResults([]); setSearched(false);
    }
  };

  const handleSearch = async () => {
    if (!image) { toast.error('Select a photo first'); return; }
    setLoading(true); setSearched(false);
    try {
      const fd = new FormData();
      fd.append('image', image);
      const { data } = await visualSearch(fd);
      setResults(data.results || []);
      setInfo({ message: data.message, method: data.searchMethod });
      setSearched(true);
      if (data.results?.length > 0) toast.success(`Found ${data.results.length} matches!`);
      else toast('No matches. Try generating fingerprints first.', { icon: 'ℹ️' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Search failed');
      setSearched(true);
    } finally { setLoading(false); }
  };

  const handleRegen = async () => {
    setRegen(true);
    toast('Generating fingerprints... wait 1-2 minutes', { icon: '🤖', duration: 8000 });
    try {
      const { data } = await regenerateEmbeddings();
      toast.success(data.message || 'Done!');
    } catch (err) {
      toast.error('Failed: ' + (err.response?.data?.message || err.message));
    } finally { setRegen(false); }
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 20px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 6px' }}>📷 Visual Search</h1>
      <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 20px' }}>
        Upload photo of customer's phone → AI finds matching pouches in your inventory
      </p>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { n: '1', t: 'Upload phone photo' },
          { n: '2', t: 'AI analyzes phone' },
          { n: '3', t: 'Matching pouches shown' }
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              background: '#6366f1', color: 'white', width: 22, height: 22,
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0
            }}>{s.n}</span>
            <span style={{ fontSize: 13, color: '#4c1d95' }}>{s.t}</span>
            {i < 2 && <span style={{ color: '#7c3aed' }}>→</span>}
          </div>
        ))}
      </div>

      {/* Setup button */}
      <div style={{
        background: '#fef9c3', border: '1px solid #fde047',
        borderRadius: 10, padding: '14px 18px', marginBottom: 20,
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 10
      }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 13, margin: '0 0 3px', color: '#92400e' }}>
            ⚡ Run this ONCE before using visual search
          </p>
          <p style={{ fontSize: 12, color: '#92400e', margin: 0 }}>
            Generates AI fingerprints for all your products. Required for matching to work.
          </p>
        </div>
        <button onClick={handleRegen} disabled={regen} style={{
          padding: '10px 20px', background: regen ? '#fcd34d' : '#f59e0b',
          color: 'white', border: 'none', borderRadius: 8,
          fontWeight: 700, fontSize: 13, cursor: regen ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap'
        }}>
          {regen ? '⏳ Generating...' : '🤖 Generate AI Fingerprints'}
        </button>
      </div>

      {/* Upload + Preview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: preview ? '1fr 1fr' : '1fr',
        gap: 20, marginBottom: 20
      }}>
        <div onDrop={handleDrop} onDragOver={e => e.preventDefault()}
          style={{
            border: `2px dashed ${image ? '#6366f1' : '#d1d5db'}`,
            borderRadius: 12, padding: 36, textAlign: 'center',
            background: image ? '#f5f3ff' : '#f9fafb'
          }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>📷</div>
          <p style={{ fontWeight: 600, color: '#374151', margin: '0 0 6px', fontSize: 16 }}>
            Customer's Phone Photo
          </p>
          <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>
            Drag & drop or click below
          </p>
          <input type="file" accept="image/*" capture="environment"
            id="vup" style={{ display: 'none' }} onChange={handleSelect} />
          <button type="button" onClick={() => document.getElementById('vup').click()}
            style={{
              padding: '12px 28px', background: '#6366f1',
              color: 'white', border: 'none', borderRadius: 8,
              cursor: 'pointer', fontWeight: 600, fontSize: 15
            }}>
            📁 Choose Photo
          </button>
        </div>

        {preview && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>
              Selected Photo:
            </p>
            <img src={preview} alt="preview"
              style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 12,
                border: '3px solid #6366f1', objectFit: 'contain' }} />
            <button onClick={() => { setImage(null); setPreview(null); setResults([]); setSearched(false); }}
              style={{ marginTop: 10, padding: '6px 14px', border: '1px solid #e5e7eb',
                borderRadius: 6, background: 'white', color: '#6b7280',
                fontSize: 12, cursor: 'pointer' }}>
              ✕ Remove
            </button>
          </div>
        )}
      </div>

      {/* Search button */}
      {image && !loading && (
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <button onClick={handleSearch} style={{
            padding: '16px 60px',
            background: 'linear-gradient(135deg,#6366f1,#7c3aed)',
            color: 'white', border: 'none', borderRadius: 12,
            fontSize: 17, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(99,102,241,0.4)'
          }}>
            🔍 Find Matching Pouches
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{
          textAlign: 'center', padding: '40px 20px',
          background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', marginBottom: 20
        }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🤖</div>
          <p style={{ fontWeight: 700, fontSize: 16, color: '#374151', margin: '0 0 8px' }}>
            AI is analyzing the phone...
          </p>
          <p style={{ color: '#9ca3af', fontSize: 13 }}>
            First search may take 20-30 seconds. Please wait.
          </p>
        </div>
      )}

      {/* Results */}
      {searched && !loading && (
        <div>
          <div style={{ marginBottom: 14, display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
              {results.length > 0 ? `🎯 ${results.length} Matching Pouches Found` : '❌ No Matches Found'}
            </h2>
            {info.method && (
              <span style={{
                fontSize: 12, padding: '3px 10px', borderRadius: 20,
                background: info.method === 'ai' ? '#dcfce7' : '#fef9c3',
                color: info.method === 'ai' ? '#166534' : '#854d0e', fontWeight: 600
              }}>
                {info.method === 'ai' ? '🤖 AI Search' : '🎨 Color Match'}
              </span>
            )}
          </div>

          {results.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: 40, background: 'white',
              borderRadius: 12, border: '1px dashed #e5e7eb'
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🤔</div>
              <h3>No matches found</h3>
              <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 16 }}>
                Click "Generate AI Fingerprints" above, wait 2 minutes, then try again
              </p>
              <button onClick={() => window.location.href = '/search'}
                style={{
                  padding: '10px 24px', background: '#6366f1', color: 'white',
                  border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600
                }}>
                Try Text Search Instead →
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))',
              gap: 16
            }}>
              {results.map(p => (
                <ProductCard key={p._id} product={p} showMatch={true} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
