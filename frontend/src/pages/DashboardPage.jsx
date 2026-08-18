import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.get().then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!data) return <div>Failed to load dashboard.</div>;

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Dashboard</h1></div>
      <div className="dashboard-grid">
        <DashboardCard title="Total Products" value={data.total_products} icon="📦" />
        <DashboardCard title="Total Customers" value={data.total_customers} icon="👥" />
        <DashboardCard title="Total Suppliers" value={data.total_suppliers} icon="🏢" />
        <DashboardCard title="Total Orders" value={data.total_orders} icon="🧾" />
        <DashboardCard title="Low Stock Items" value={data.low_stock_count} icon="⚠️" />
        <DashboardCard title="Revenue" value={`$${data.revenue || 0}`} icon="💰" />
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem'}}>
        <div>
          <h3>Recent Orders</h3>
          <DataTable 
            data={data.recent_orders || []} 
            columns={[
              { header: 'ID', field: 'id' },
              { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
              { header: 'Total', field: 'total_amount' }
            ]} 
          />
        </div>
        <div>
          <h3>Recent Purchases</h3>
          <DataTable 
            data={data.recent_purchases || []} 
            columns={[
              { header: 'ID', field: 'id' },
              { header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
              { header: 'Total', field: 'total_amount' }
            ]} 
          />
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
