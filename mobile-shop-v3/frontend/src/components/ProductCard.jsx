import { useNavigate } from 'react-router-dom';
import { deleteProduct } from '../api/api';
import toast from 'react-hot-toast';

export default function ProductCard({ product, onDelete, showMatch }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      await deleteProduct(product._id);
      toast.success('Deleted');
      if (onDelete) onDelete(product._id);
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div style={{background:'white', border:'1px solid #e5e7eb',
      borderRadius:12, overflow:'hidden',
      boxShadow: showMatch && product.matchPercent > 70 ? '0 0 0 2px #6366f1' : 'none'}}
    >
      {/* Image area */}
      <div style={{position:'relative', height:160, background:'#f9fafb'}}>
        {product.images?.[0] ? (
          <img src={product.images[0].url} alt={product.name}
            style={{width:'100%', height:'100%', objectFit:'cover'}} />
        ) : (
          <div style={{height:'100%', display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:44}}>📱</div>
        )}
        {/* Stock badge */}
        <span style={{position:'absolute', top:8, right:8,
          background: product.quantity > 5 ? '#dcfce7' : product.quantity > 0 ? '#fef9c3' : '#fee2e2',
          color: product.quantity > 5 ? '#166534' : product.quantity > 0 ? '#854d0e' : '#991b1b',
          fontSize:11, fontWeight:600, padding:'3px 8px', borderRadius:20}}>
          {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
        </span>
        {/* Match % badge for visual search */}
        {showMatch && product.matchPercent !== undefined && (
          <span style={{position:'absolute', top:8, left:8,
            background: product.matchPercent > 70 ? '#6366f1' : '#7c3aed',
            color:'white', fontSize:12, fontWeight:700,
            padding:'3px 8px', borderRadius:20}}>
            {product.matchPercent}% match
          </span>
        )}
      </div>

      {/* Product details */}
      <div style={{padding:12}}>
        <p style={{fontWeight:600, fontSize:14, margin:'0 0 2px', color:'#111827',
          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
          {product.name}
        </p>
        <p style={{fontSize:12, color:'#6b7280', margin:'0 0 4px'}}>
          📱 {product.deviceModel}
        </p>
        <div style={{display:'flex', gap:4, flexWrap:'wrap', marginBottom:6}}>
          {product.caseType && (
            <span style={{fontSize:11, background:'#ede9fe',
              color:'#5b21b6', padding:'2px 6px', borderRadius:4}}>
              {product.caseType}
            </span>
          )}
          {product.designStyle && (
            <span style={{fontSize:11, background:'#fce7f3',
              color:'#9d174d', padding:'2px 6px', borderRadius:4}}>
              {product.designStyle}
            </span>
          )}
        </div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6}}>
          <span style={{fontWeight:700, fontSize:16, color:'#6366f1'}}>₹{product.price}</span>
          <span style={{fontSize:11, color:'#9ca3af'}}>📍 {product.shelfLocation || 'No location'}</span>
        </div>

        {/* Edit and Delete buttons */}
        <div style={{display:'flex', gap:8}}>
          <button onClick={() => navigate(`/edit-product/${product._id}`)}
            style={{flex:1, padding:'8px', border:'1.5px solid #6366f1',
              borderRadius:7, background:'white', color:'#6366f1',
              fontSize:13, fontWeight:600, cursor:'pointer'}}>
            ✏️ Edit
          </button>
          <button onClick={handleDelete}
            style={{flex:1, padding:'8px', border:'1px solid #fecaca',
              borderRadius:7, background:'white', color:'#ef4444',
              fontSize:13, cursor:'pointer'}}>
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
}
