import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const loadData = () => { setLoading(true); productsAPI.getAll().then(res => { setProducts(res.data); setLoading(false); }); };
  useEffect(() => { loadData(); }, []);

  const handleDelete = () => { productsAPI.delete(currentId).then(() => loadData()); };

  const columns = [
    { header: 'Name', field: 'name' },
    { header: 'SKU', field: 'sku' },
    { header: 'Category', render: row => row.category_name || row.category },
    { header: 'Price', field: 'price' },
    { header: 'Stock', field: 'stock_quantity' },
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
        <h1 className="page-title">Products</h1>
        <button className="btn btn-primary" onClick={() => navigate('/products/new')}>Add Product</button>
      </div>
      {loading ? <LoadingSpinner /> : <DataTable data={products} columns={columns} />}
      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} message="Delete this product?" />
    </div>
  );
};
export default ProductsPage;
