import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../api/api';
import toast from 'react-hot-toast';

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [form, setForm] = useState({
    name: '', deviceModel: '', category: 'Phone Case',
    caseType: '', designStyle: '', brand: '',
    color: '', price: '', quantity: '', shelfLocation: '', tags: ''
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) { toast.error('Max 5 images'); return; }
    setImageFiles(files);
    // Show previews before upload
    const urls = files.map(f => URL.createObjectURL(f));
    setPreviews(urls);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.deviceModel) {
      toast.error('Product name and device model are required');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val) formData.append(key, val);
      });
      imageFiles.forEach(file => formData.append('images', file));

      await addProduct(formData);
      toast.success('Product added successfully!');
      navigate('/inventory');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid #e5e7eb', borderRadius: 8,
    fontSize: 14, boxSizing: 'border-box', outline: 'none',
    background: 'white'
  };

  const labelStyle = {
    display: 'block', fontSize: 12,
    fontWeight: 600, color: '#374151', marginBottom: 5
  };

  const fieldGroup = (label, name, type = 'text', placeholder = '', required = false) => (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label} {required && <span style={{ color: '#ef4444' }}>*</span>}</label>
      <input type={type} name={name} placeholder={placeholder}
        required={required} value={form[name]}
        onChange={handleChange} style={inputStyle} />
    </div>
  );

  const selectGroup = (label, name, options) => (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      <select name={name} value={form[name]} onChange={handleChange}
        style={{ ...inputStyle, cursor: 'pointer' }}>
        <option value="">-- Select --</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '28px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <button onClick={() => navigate(-1)} style={{
          background: 'none', border: 'none', color: '#6b7280',
          cursor: 'pointer', fontSize: 14, padding: 0, marginBottom: 8
        }}>
          ← Back
        </button>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Add New Product</h1>
        <p style={{ color: '#6b7280', fontSize: 13, margin: '4px 0 0' }}>
          Fill in the details of the phone case or pouch
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: 'white', borderRadius: 12,
        border: '1px solid #e5e7eb', padding: 28
      }}>

        {/* Section: Basic Info */}
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#6366f1', margin: '0 0 16px', paddingBottom: 8, borderBottom: '1px solid #e5e7eb' }}>
          📋 Basic Information
        </h3>

        {fieldGroup('Product Name', 'name', 'text', 'e.g. Samsung A12 Flip Cover Black', true)}
        {fieldGroup('Device Model', 'deviceModel', 'text', 'e.g. Samsung Galaxy A12, iPhone 13, Redmi Note 10', true)}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            {selectGroup('Category', 'category', ['Phone Case', 'Phone Pouch', 'Screen Guard', 'Earphones', 'Charger', 'Cable', 'Other'])}
          </div>
          <div>
            {selectGroup('Case Type', 'caseType', ['Flip Cover', 'Transparent', 'Silicon', 'Hard Back', 'Leather', 'Wallet Case', 'Ring Case'])}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            {selectGroup('Design Style', 'designStyle', ['Normal', 'Ladies Design', 'Premium', 'Kids', 'Sports', 'Printed'])}
          </div>
          <div>
            {fieldGroup('Brand', 'brand', 'text', 'e.g. Spigen, OtterBox, Local')}
          </div>
        </div>

        {/* Section: Price & Stock */}
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#6366f1', margin: '16px 0 16px', paddingBottom: 8, borderBottom: '1px solid #e5e7eb' }}>
          💰 Price & Stock
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Price (₹)</label>
            <input type="number" name="price" placeholder="150" min="0"
              value={form.price} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Quantity</label>
            <input type="number" name="quantity" placeholder="10" min="0"
              value={form.quantity} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            {fieldGroup('Color', 'color', 'text', 'e.g. Black, Blue')}
          </div>
        </div>

        {/* Section: Location */}
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#6366f1', margin: '16px 0 16px', paddingBottom: 8, borderBottom: '1px solid #e5e7eb' }}>
          📍 Shop Location
        </h3>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Shelf / Box Location</label>
          <input type="text" name="shelfLocation"
            placeholder="e.g. Shelf 2 Box 3, Counter Display A2, Drawer 1"
            value={form.shelfLocation} onChange={handleChange} style={inputStyle} />
          <p style={{ fontSize: 11, color: '#9ca3af', margin: '4px 0 0' }}>
            This helps you find the product quickly in your shop
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Tags (for better search)</label>
          <input type="text" name="tags"
            placeholder="e.g. iphone,flip,ladies,black (comma separated)"
            value={form.tags} onChange={handleChange} style={inputStyle} />
        </div>

        {/* Section: Photos */}
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#6366f1', margin: '0 0 16px', paddingBottom: 8, borderBottom: '1px solid #e5e7eb' }}>
          📷 Product Photos (up to 5)
        </h3>

        <div style={{
          border: '2px dashed #e5e7eb', borderRadius: 8, padding: 20,
          textAlign: 'center', marginBottom: 20, cursor: 'pointer',
          background: '#f9fafb'
        }}>
          <input type="file" accept="image/*" multiple
            onChange={handleImageChange}
            style={{ display: 'none' }} id="imageUpload" />
          <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📸</div>
            <p style={{ color: '#6b7280', margin: 0, fontSize: 14 }}>
              Click to select photos
            </p>
            <p style={{ color: '#9ca3af', margin: '4px 0 0', fontSize: 12 }}>
              JPG, PNG or WebP · Max 5MB each · Up to 5 photos
            </p>
          </label>
        </div>

        {/* Image previews */}
        {previews.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {previews.map((url, i) => (
              <img key={i} src={url} alt={`preview ${i}`}
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
            ))}
          </div>
        )}

        {/* Submit */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" disabled={loading} style={{
            flex: 1, padding: '12px', background: loading ? '#a5b4fc' : '#6366f1',
            color: 'white', border: 'none', borderRadius: 8,
            fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer'
          }}>
            {loading ? 'Saving product...' : '✓ Add Product'}
          </button>
          <button type="button" onClick={() => navigate(-1)} style={{
            padding: '12px 20px', background: 'white', color: '#6b7280',
            border: '1.5px solid #e5e7eb', borderRadius: 8, cursor: 'pointer', fontSize: 14
          }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
