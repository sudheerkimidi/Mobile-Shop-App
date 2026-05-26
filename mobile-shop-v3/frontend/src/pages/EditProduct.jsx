import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, updateProduct } from '../api/api';
import toast from 'react-hot-toast';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [form, setForm] = useState({
    name: '', deviceModel: '', category: 'Phone Case',
    caseType: '', designStyle: '', brand: '',
    color: '', price: '', quantity: '', shelfLocation: '', tags: ''
  });

  useEffect(() => { loadProduct(); }, []);

  const loadProduct = async () => {
    try {
      const { data } = await getProduct(id);
      const p = data.product;
      setForm({
        name: p.name || '', deviceModel: p.deviceModel || '',
        category: p.category || 'Phone Case', caseType: p.caseType || '',
        designStyle: p.designStyle || '', brand: p.brand || '',
        color: p.color || '', price: p.price || '',
        quantity: p.quantity || '', shelfLocation: p.shelfLocation || '',
        tags: Array.isArray(p.tags) ? p.tags.join(',') : (p.tags || '')
      });
    } catch { toast.error('Could not load product'); }
    finally { setFetching(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v); });
      newImages.forEach(f => fd.append('images', f));
      await updateProduct(id, fd);
      toast.success('Product updated!');
      navigate('/inventory');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  const inp = { width:'100%', padding:'10px 14px', border:'1.5px solid #e5e7eb',
    borderRadius:8, fontSize:14, boxSizing:'border-box', outline:'none' };
  const lbl = { display:'block', fontSize:12, fontWeight:600, color:'#374151', marginBottom:5 };
  const sec = { fontSize:14, fontWeight:600, color:'#6366f1', margin:'16px 0 12px',
    paddingBottom:8, borderBottom:'1px solid #e5e7eb' };

  if (fetching) return (
    <div style={{textAlign:'center',padding:60,fontSize:16,color:'#6b7280'}}>
      Loading product...
    </div>
  );

  return (
    <div style={{maxWidth:700, margin:'0 auto', padding:'28px 20px'}}>
      <button onClick={() => navigate(-1)} style={{
        background:'none', border:'none', color:'#6b7280',
        cursor:'pointer', fontSize:14, marginBottom:12
      }}>← Back to Inventory</button>
      <h1 style={{fontSize:22, fontWeight:700, margin:'0 0 4px'}}>Edit Product</h1>
      <p style={{color:'#6b7280', fontSize:13, margin:'0 0 24px'}}>
        Update price, photos, location or any detail
      </p>
      <form onSubmit={handleSubmit} style={{
        background:'white', borderRadius:12,
        border:'1px solid #e5e7eb', padding:28
      }}>
        <h3 style={sec}>📋 Basic Information</h3>
        <div style={{marginBottom:14}}>
          <label style={lbl}>Product Name *</label>
          <input required style={inp} value={form.name}
            onChange={e => setForm({...form, name:e.target.value})}
            placeholder="e.g. Samsung A12 Flip Cover" />
        </div>
        <div style={{marginBottom:14}}>
          <label style={lbl}>Device Model *</label>
          <input required style={inp} value={form.deviceModel}
            onChange={e => setForm({...form, deviceModel:e.target.value})}
            placeholder="e.g. Samsung Galaxy A12" />
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14}}>
          <div>
            <label style={lbl}>Case Type</label>
            <select style={{...inp, cursor:'pointer'}} value={form.caseType}
              onChange={e => setForm({...form, caseType:e.target.value})}>
              <option value="">-- Select --</option>
              {['Flip Cover','Transparent','Silicon','Hard Back','Leather','Wallet Case','Ring Case']
                .map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Design Style</label>
            <select style={{...inp, cursor:'pointer'}} value={form.designStyle}
              onChange={e => setForm({...form, designStyle:e.target.value})}>
              <option value="">-- Select --</option>
              {['Normal','Ladies Design','Premium','Kids','Sports','Printed']
                .map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14}}>
          <div>
            <label style={lbl}>Brand</label>
            <input style={inp} value={form.brand}
              onChange={e => setForm({...form, brand:e.target.value})}
              placeholder="Local / Spigen etc." />
          </div>
          <div>
            <label style={lbl}>Color</label>
            <input style={inp} value={form.color}
              onChange={e => setForm({...form, color:e.target.value})}
              placeholder="Black / Blue" />
          </div>
        </div>

        <h3 style={sec}>💰 Price & Stock</h3>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14}}>
          <div>
            <label style={lbl}>Price (₹)</label>
            <input type="number" min="0" style={inp} value={form.price}
              onChange={e => setForm({...form, price:e.target.value})}
              placeholder="150" />
          </div>
          <div>
            <label style={lbl}>Quantity</label>
            <input type="number" min="0" style={inp} value={form.quantity}
              onChange={e => setForm({...form, quantity:e.target.value})}
              placeholder="10" />
          </div>
        </div>

        <h3 style={sec}>📍 Shop Location & Tags</h3>
        <div style={{marginBottom:14}}>
          <label style={lbl}>Shelf / Box Location</label>
          <input style={inp} value={form.shelfLocation}
            onChange={e => setForm({...form, shelfLocation:e.target.value})}
            placeholder="e.g. Shelf 2 Box 3" />
        </div>
        <div style={{marginBottom:20}}>
          <label style={lbl}>Tags (comma separated)</label>
          <input style={inp} value={form.tags}
            onChange={e => setForm({...form, tags:e.target.value})}
            placeholder="samsung,flip,black" />
        </div>

        <h3 style={sec}>📷 Add More Photos</h3>
        <div style={{border:'2px dashed #e5e7eb', borderRadius:8, padding:20,
          textAlign:'center', marginBottom:16, background:'#f9fafb'}}>
          <input type="file" accept="image/*" multiple id="editImg"
            style={{display:'none'}}
            onChange={e => {
              const files = Array.from(e.target.files);
              setNewImages(files);
              setPreviews(files.map(f => URL.createObjectURL(f)));
            }} />
          <label htmlFor="editImg" style={{cursor:'pointer'}}>
            <div style={{fontSize:32, marginBottom:8}}>📸</div>
            <p style={{color:'#6b7280', margin:0, fontSize:14}}>Click to add new photos</p>
          </label>
        </div>
        {previews.length > 0 && (
          <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:16}}>
            {previews.map((u,i) => (
              <img key={i} src={u} alt="preview"
                style={{width:80, height:80, objectFit:'cover',
                  borderRadius:8, border:'2px solid #6366f1'}} />
            ))}
          </div>
        )}

        <div style={{display:'flex', gap:12}}>
          <button type="submit" disabled={loading} style={{
            flex:1, padding:'13px', background: loading ? '#a5b4fc' : '#6366f1',
            color:'white', border:'none', borderRadius:8,
            fontSize:15, fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer'
          }}>
            {loading ? 'Saving...' : '✓ Save All Changes'}
          </button>
          <button type="button" onClick={() => navigate(-1)} style={{
            padding:'13px 20px', background:'white', color:'#6b7280',
            border:'1.5px solid #e5e7eb', borderRadius:8, cursor:'pointer', fontSize:14
          }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
