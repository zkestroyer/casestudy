import React, { useState, useEffect } from 'react';
import { ordersAPI, paymentsAPI } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import SelectInput from '../components/SelectInput';
import { CheckCircle, CreditCard, ArrowLeft, AlertCircle } from 'lucide-react';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Payment Modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [savingPayment, setSavingPayment] = useState(false);

  const loadData = () => { 
    setLoading(true); 
    setError(null);
    ordersAPI.getById(id)
      .then(res => { 
        setData(res.data); 
        setLoading(false); 
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load order details.");
        setLoading(false);
      }); 
  };

  useEffect(() => { loadData(); }, [id]);

  const handleConfirm = () => {
    setConfirming(true);
    setError(null);
    setSuccess(null);
    ordersAPI.confirm(id)
      .then(res => {
        setSuccess(res.data?.message || "Order confirmed and stock updated successfully.");
        setConfirming(false);
        loadData();
      })
      .catch(err => {
        const errorMsg = err.response?.data?.error || "Failed to confirm order. Please check inventory.";
        setError(errorMsg);
        setConfirming(false);
      });
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    setSavingPayment(true);
    paymentsAPI.create({
      sales_order: id,
      amount: paymentAmount,
      payment_method: paymentMethod,
      status: 'completed'
    })
      .then(() => {
        setSavingPayment(false);
        setPaymentModalOpen(false);
        setSuccess(`Payment of $${paymentAmount} recorded successfully.`);
        loadData();
      })
      .catch(err => {
        console.error(err);
        alert(err.response?.data?.error || "Failed to record payment.");
        setSavingPayment(false);
      });
  };

  if (loading) return <LoadingSpinner />;
  if (!data) return <div style={{ padding: '2rem' }}>Order not found.</div>;

  const columns = [
    { header: 'Product', render: row => row.product_name || `Product #${row.product}` },
    { header: 'Quantity', field: 'quantity' },
    { header: 'Unit Price', render: row => `$${parseFloat(row.unit_price).toFixed(2)}` },
    { header: 'Subtotal', render: row => `$${parseFloat(row.subtotal).toFixed(2)}` }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales Order #{data.id}</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>View customer order specifications and fulfillment status.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/orders')}>
            <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back
          </button>
          
          {(data.status === 'draft' || data.status === 'pending') && (
            <button className="btn btn-primary" onClick={handleConfirm} disabled={confirming}>
              <CheckCircle size={16} style={{ marginRight: '6px' }} />
              {confirming ? 'Confirming...' : 'Confirm Order'}
            </button>
          )}

          {data.status === 'confirmed' && (
            <button 
              className="btn btn-primary" 
              onClick={() => { 
                setPaymentAmount(data.total_amount); 
                setPaymentModalOpen(true); 
              }}
            >
              <CreditCard size={16} style={{ marginRight: '6px' }} /> Record Payment
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
          <h4 style={{ marginBottom: '1rem', color: '#1e293b' }}>Order Information</h4>
          <p style={{ marginBottom: '0.5rem' }}><strong>Customer:</strong> {data.customer_name || `Customer #${data.customer}`}</p>
          <p style={{ marginBottom: '0.5rem' }}><strong>Order Date:</strong> {data.order_date}</p>
          <p style={{ marginBottom: '0.5rem' }}><strong>Status:</strong> <StatusBadge status={data.status} /></p>
        </div>
        <div className="card">
          <h4 style={{ marginBottom: '1rem', color: '#1e293b' }}>Financial Summary</h4>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            ${parseFloat(data.total_amount).toFixed(2)}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Total calculated atomically from {data.items ? data.items.length : 0} line item(s).
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Order Line Items</h3>
        </div>
        <DataTable data={data.items || []} columns={columns} />
      </div>

      {/* Record Payment Modal */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title={`Record Payment for Order #${data.id}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setPaymentModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleRecordPayment} disabled={savingPayment}>
              {savingPayment ? 'Saving...' : 'Submit Payment'}
            </button>
          </>
        }
      >
        <form onSubmit={handleRecordPayment}>
          <FormInput
            label="Payment Amount ($)"
            type="number"
            step="0.01"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            required
          />
          <SelectInput
            label="Payment Method"
            options={[
              { id: 'card', name: 'Credit / Debit Card' },
              { id: 'bank_transfer', name: 'Bank Transfer' },
              { id: 'cash', name: 'Cash' }
            ]}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
};

export default OrderDetailPage;
