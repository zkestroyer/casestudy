import React, { useState, useEffect } from 'react';
import { purchasesAPI } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';

const PurchaseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => { setLoading(true); purchasesAPI.getById(id).then(res => { setData(res.data); setLoading(false); }); };
  useEffect(() => { loadData(); }, [id]);

  const handleConfirm = () => { purchasesAPI.confirm(id).then(() => loadData()); };

  if (loading) return <LoadingSpinner />;
  if (!data) return <div>Not found</div>;

  const columns = [
    { header: 'Product', render: row => row.product_name || row.product },
    { header: 'Quantity', field: 'quantity' },
    { header: 'Unit Price', field: 'unit_price' },
    { header: 'Subtotal', render: row => (row.quantity * row.unit_price).toFixed(2) }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Purchase #{data.id}</h1>
        <div>
          <button className="btn btn-secondary" onClick={() => navigate('/purchases')} style={{marginRight: '0.5rem'}}>Back</button>
          {data.status === 'draft' || data.status === 'pending' ? (
            <button className="btn btn-primary" onClick={handleConfirm}>Confirm Purchase</button>
          ) : null}
        </div>
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem'}}>
        <div className="card">
          <p><strong>Supplier:</strong> {data.supplier_name || data.supplier}</p>
          <p><strong>Date:</strong> {data.order_date}</p>
          <p><strong>Status:</strong> <StatusBadge status={data.status} /></p>
        </div>
        <div className="card">
          <p><strong>Total Amount:</strong> ${data.total_amount}</p>
        </div>
      </div>

      <h3>Line Items</h3>
      <DataTable data={data.items || []} columns={columns} />
    </div>
  );
};
export default PurchaseDetailPage;
