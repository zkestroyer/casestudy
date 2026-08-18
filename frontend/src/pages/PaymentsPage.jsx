import React, { useState, useEffect } from 'react';
import { paymentsAPI, ordersAPI } from '../services/api';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import SelectInput from '../components/SelectInput';

const PaymentsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ order: '', amount: '', payment_method: 'cash' });
  const [orders, setOrders] = useState([]);

  const loadData = () => { setLoading(true); paymentsAPI.getAll().then(res => { setData(res.data); setLoading(false); }); };
  useEffect(() => { loadData(); ordersAPI.getAll().then(res => setOrders(res.data)); }, []);

  const handleSave = () => { paymentsAPI.create({...formData, sales_order: formData.order}).then(() => { setModalOpen(false); loadData(); }); };

  const columns = [
    { header: 'ID', field: 'id' },
    { header: 'Order ID', field: 'order' },
    { header: 'Amount', field: 'amount' },
    { header: 'Method', field: 'payment_method' },
    { header: 'Date', field: 'payment_date' },
    { header: 'Status', render: row => <StatusBadge status={row.status} /> }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Payments</h1>
        <button className="btn btn-primary" onClick={() => { setFormData({order:'', amount:'', payment_method:'cash'}); setModalOpen(true); }}>Record Payment</button>
      </div>
      {loading ? <LoadingSpinner /> : <DataTable data={data} columns={columns} />}
      
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Record Payment" footer={<><button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Save</button></>}>
        <SelectInput label="Order" options={orders} valueKey="id" labelKey="id" value={formData.order} onChange={e => setFormData({...formData, order: e.target.value})} />
        <FormInput label="Amount" type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
        <SelectInput label="Payment Method" options={[{id:'cash', name:'Cash'}, {id:'card', name:'Card'}, {id:'bank_transfer', name:'Bank Transfer'}]} value={formData.payment_method} onChange={e => setFormData({...formData, payment_method: e.target.value})} />
      </Modal>
    </div>
  );
};
export default PaymentsPage;
