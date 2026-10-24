import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog';
import { Search } from 'lucide-react';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const loadData = (query = '') => {
    setLoading(true);
    const params = query ? { search: query } : {};
    productsAPI.getAll(params)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      loadData(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleDelete = () => {
    productsAPI.delete(currentId).then(() => {
      setConfirmOpen(false);
      loadData(searchTerm);
    });
  };

  const columns = [
    { header: 'Name', field: 'name' },
    { header: 'SKU', field: 'sku' },
    { header: 'Category', render: row => row.category_name || '-' },
    { header: 'Price', render: row => `$${parseFloat(row.price).toFixed(2)}` },
    { header: 'Cost', render: row => `$${parseFloat(row.cost_price).toFixed(2)}` },
    { 
      header: 'Stock', 
      render: row => {
        const qty = row.stock ? row.stock.quantity : 0;
        const isLow = qty <= (row.reorder_level || 0);
        return (
          <span style={{ 
            fontWeight: 600, 
            color: qty === 0 ? '#ef4444' : (isLow ? '#f59e0b' : '#10b981') 
          }}>
            {qty} {isLow && <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>(Low)</span>}
          </span>
        );
      } 
    },
    { header: 'Actions', render: (row) => (
      <div style={{display:'flex', gap:'0.5rem'}}>
        <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/products/${row.id}/edit`)}>Edit</button>
        <button className="btn btn-sm btn-danger" onClick={() => { setCurrentId(row.id); setConfirmOpen(true); }}>Delete</button>
      </div>
    )}
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Products Catalog</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Manage inventory items, SKUs, and pricing.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/products/new')}>+ Add Product</button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search SKU or product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2rem' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </div>
      </div>

      {loading ? <LoadingSpinner /> : <DataTable data={products} columns={columns} />}
      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} message="Are you sure you want to delete this product?" />
    </div>
  );
};

export default ProductsPage;
