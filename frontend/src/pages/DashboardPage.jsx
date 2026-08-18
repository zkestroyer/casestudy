import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PackageSearch, CircleDollarSign, ShoppingCart, Users, PackagePlus, UserPlus, CreditCard } from 'lucide-react';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
  if (!data) return <EmptyState title="Dashboard Unavailable" description="Unable to load dashboard data." />;

  const pieColors = ['#15803d', '#f59e0b', '#3b82f6', '#ef4444']; // Completed, Pending, Processing, Cancelled

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Here's an overview of your business performance.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => navigate('/products/new')}>
            <PackagePlus size={16} style={{ marginRight: '8px' }} /> Add Product
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/orders/new')}>
            <ShoppingCart size={16} style={{ marginRight: '8px' }} /> Create Order
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-grid">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="card-title">Total Revenue</div>
              <div className="card-value">${data.revenue?.toLocaleString() || 0}</div>
            </div>
            <div style={{ padding: '8px', background: '#ecfdf5', borderRadius: '8px', color: '#10b981' }}>
              <CircleDollarSign size={24} />
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="card-title">Total Orders</div>
              <div className="card-value">{data.total_orders?.toLocaleString() || 0}</div>
            </div>
            <div style={{ padding: '8px', background: '#eff6ff', borderRadius: '8px', color: '#3b82f6' }}>
              <ShoppingCart size={24} />
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="card-title">Total Customers</div>
              <div className="card-value">{data.total_customers?.toLocaleString() || 0}</div>
            </div>
            <div style={{ padding: '8px', background: '#f5f3ff', borderRadius: '8px', color: '#8b5cf6' }}>
              <Users size={24} />
            </div>
          </div>
        </div>
        <div className="card" style={{ borderLeft: data.low_stock_count > 0 ? '4px solid #ef4444' : '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="card-title">Low Stock</div>
              <div className="card-value">{data.low_stock_count || 0}</div>
              <div style={{ fontSize: '0.75rem', color: data.low_stock_count > 0 ? '#ef4444' : '#64748b', marginTop: '4px' }}>
                {data.low_stock_count > 0 ? 'Requires immediate attention' : 'Inventory levels healthy'}
              </div>
            </div>
            <div style={{ padding: '8px', background: data.low_stock_count > 0 ? '#fef2f2' : '#f8fafc', borderRadius: '8px', color: data.low_stock_count > 0 ? '#ef4444' : '#94a3b8' }}>
              <PackageSearch size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Revenue Overview</h3>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Last 6 Months</span>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            {data.revenue_history && data.revenue_history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.revenue_history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `$${val}`} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No Revenue Data" description="No sales orders have been completed yet." />
            )}
          </div>
        </div>
        
        <div className="card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Order Status</h3>
          <div style={{ height: '300px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {data.order_status_breakdown && data.order_status_breakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={data.order_status_breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.order_status_breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No Orders" description="Create a sales order to see status breakdowns." />
            )}
            
            {/* Legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: 'auto' }}>
              {data.order_status_breakdown?.map((entry, i) => (
                <div key={entry.name} style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#475569' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: pieColors[i % pieColors.length], marginRight: '6px' }}></div>
                  {entry.name} ({entry.value})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        
        {/* Recent Orders Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Recent Orders</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/orders')}>View All</button>
          </div>
          {data.recent_orders && data.recent_orders.length > 0 ? (
            <div className="table-container" style={{ border: 'none', boxShadow: 'none', borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_orders.map(order => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 500, color: '#0f172a' }}>#{order.id}</td>
                      <td>{order.customer_name}</td>
                      <td><StatusBadge status={order.status} /></td>
                      <td style={{ textAlign: 'right', fontWeight: 500 }}>${order.total_amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '2rem' }}>
              <EmptyState title="No recent orders" description="Sales orders will appear here." action={<button className="btn btn-primary" onClick={() => navigate('/orders/new')}>Create Order</button>} />
            </div>
          )}
        </div>

        {/* Low Stock Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Low Stock Products</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/stock')}>View Inventory</button>
          </div>
          {data.low_stock_items && data.low_stock_items.length > 0 ? (
            <div className="table-container" style={{ border: 'none', boxShadow: 'none', borderRadius: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.low_stock_items.map(item => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 500, color: '#0f172a' }}>{item.name}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{item.quantity} / {item.minimum}</span>
                          <div style={{ height: '4px', width: '40px', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(100, (item.quantity/item.minimum)*100)}%`, backgroundColor: item.quantity === 0 ? '#ef4444' : '#f59e0b' }}></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${item.quantity === 0 ? 'badge-danger' : 'badge-warning'}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '2rem' }}>
              <EmptyState title="Inventory Healthy" description="No products are currently low on stock." icon={PackageSearch} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
