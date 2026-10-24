import React, { useState, useEffect } from 'react';
import { purchasesAPI } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';

const PurchaseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const loadData = () => { 
    setLoading(true); 
    setError(null);
    purchasesAPI.getById(id)
      .then(res => { 
        setData(res.data); 
        setLoading(false); 
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load purchase order details.");
        setLoading(false);
      }); 
  };

  useEffect(() => { loadData(); }, [id]);

  const handleConfirm = () => {
    setConfirming(true);
    setError(null);
    setSuccess(null);
    purchasesAPI.confirm(id)
      .then(res => {
        setSuccess(res.data?.message || "Purchase order confirmed and stock incremented successfully.");
        setConfirming(false);
        loadData();
      })
      .catch(err => {
        const errorMsg = err.response?.data?.error || "Failed to confirm purchase order.";
        setError(errorMsg);
        setConfirming(false);
      });
  };

  if (loading) return <LoadingSpinner />;
  if (!data) return <div style={{ padding: '2rem' }}>Purchase Order not found.</div>;

  const columns = [
    { header: 'Product', render: row => row.product_name || `Product #${row.product}` },
    { header: 'Quantity', field: 'quantity' },
    { header: 'Unit Cost', render: row => `$${parseFloat(row.unit_cost).toFixed(2)}` },
    { header: 'Subtotal', render: row => `$${parseFloat(row.subtotal).toFixed(2)}` }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Purchase Order #{data.id}</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>View supplier procurement details and receive goods into warehouse.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/purchases')}>
            <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back
          </button>
          {(data.status === 'draft' || data.status === 'pending') && (
            <button className="btn btn-primary" onClick={handleConfirm} disabled={confirming}>
              <CheckCircle size={16} style={{ marginRight: '6px' }} />
              {confirming ? 'Receiving Goods...' : 'Confirm Goods Received'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' }}>
          <CheckCircle size={18} /> {success}
        </div>
      )}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h4 style={{ marginBottom: '1rem', color: '#1e293b' }}>Vendor Information</h4>
          <p style={{ marginBottom: '0.5rem' }}><strong>Supplier:</strong> {data.supplier_name || `Supplier #${data.supplier}`}</p>
          <p style={{ marginBottom: '0.5rem' }}><strong>Order Date:</strong> {data.order_date}</p>
          <p style={{ marginBottom: '0.5rem' }}><strong>Status:</strong> <StatusBadge status={data.status} /></p>
        </div>
        <div className="card">
          <h4 style={{ marginBottom: '1rem', color: '#1e293b' }}>Procurement Total</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            ${parseFloat(data.total_amount).toFixed(2)}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Stock automatically increments across all {data.items ? data.items.length : 0} item(s) upon confirmation.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Purchased Line Items</h3>
        </div>
        <DataTable data={data.items || []} columns={columns} />
      </div>
    </div>
  );
};

export default PurchaseDetailPage;
