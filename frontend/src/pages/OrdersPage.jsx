import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { ordersAPI.getAll().then(res => { setData(res.data); setLoading(false); }); }, []);

  const columns = [
    { header: 'ID', field: 'id' },
    { header: 'Customer', render: row => row.customer_name || row.customer },
    { header: 'Date', field: 'order_date' },
    { header: 'Total', field: 'total_amount' },
    { header: 'Status', render: row => <StatusBadge status={row.status} /> },
    { header: 'Actions', render: (row) => (
      <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/orders/${row.id}`)}>View</button>
    )}
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <button className="btn btn-primary" onClick={() => navigate('/orders/new')}>Create Order</button>
      </div>
      {loading ? <LoadingSpinner /> : <DataTable data={data} columns={columns} />}
    </div>
  );
};
export default OrdersPage;
