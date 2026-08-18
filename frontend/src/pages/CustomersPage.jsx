import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customersAPI } from '../services/api';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';

/**
 * ACADEMIC PURPOSE:
 * Displays a list of all customers and provides actions to edit or delete them.
 * 
 * STATE MANAGEMENT:
 * - useState manages the customer list (data), loading state, and delete confirmation dialog state.
 * - useEffect is used to fetch the initial data payload exactly once when the component mounts.
 * 
 * ERROR HANDLING:
 * - try/catch is used during async API calls to prevent unhandled promise rejections.
 */
const CustomersPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => { 
    setLoading(true); 
    setError(null);
    try {
      const res = await customersAPI.getAll();
      setData(res.data);
    } catch (err) {
      console.error("Error loading customers:", err);
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { loadData(); }, []);

  const handleDelete = async () => { 
    try {
      await customersAPI.delete(currentId);
      loadData();
    } catch (err) {
      console.error("Error deleting customer:", err);
      alert("Failed to delete customer.");
    } finally {
      setConfirmOpen(false);
    }
  };

  const columns = [
    { header: 'Name', field: 'name' },
    { header: 'Email', field: 'email' },
    { header: 'Phone', field: 'phone' },
    { header: 'Address', field: 'address' },
    { header: 'Actions', render: (row) => (
      <div style={{display:'flex', gap:'0.5rem'}}>
        <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/customers/${row.id}/edit`)}>Edit</button>
        <button className="btn btn-sm btn-danger" onClick={() => { setCurrentId(row.id); setConfirmOpen(true); }}>Delete</button>
      </div>
    )}
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Customers</h1>
        <button className="btn btn-primary" onClick={() => navigate('/customers/new')}>Add Customer</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <LoadingSpinner /> : <DataTable data={data} columns={columns} />}
      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} message="Delete this customer?" />
    </div>
  );
};
export default CustomersPage;
