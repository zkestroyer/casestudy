import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { suppliersAPI } from '../services/api';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';

/**
 * ACADEMIC PURPOSE:
 * Displays a list of all suppliers and provides actions to edit or delete them.
 * 
 * STATE MANAGEMENT:
 * - useState manages the supplier list (data), loading state, and delete confirmation dialog state.
 * - useEffect is used to fetch the initial data payload exactly once when the component mounts.
 * 
 * ERROR HANDLING:
 * - try/catch is used during async API calls to prevent unhandled promise rejections.
 */
const SuppliersPage = () => {
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
      const res = await suppliersAPI.getAll();
      setData(res.data);
    } catch (err) {
      console.error("Error loading suppliers:", err);
      setError("Failed to load suppliers.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { loadData(); }, []);

  const handleDelete = async () => { 
    try {
      await suppliersAPI.delete(currentId);
      loadData();
    } catch (err) {
      console.error("Error deleting supplier:", err);
      alert("Failed to delete supplier.");
    } finally {
      setConfirmOpen(false);
    }
  };

  const columns = [
    { header: 'Name', field: 'name' },
    { header: 'Contact Person', field: 'contact_person' },
    { header: 'Email', field: 'email' },
    { header: 'Phone', field: 'phone' },
    { header: 'Actions', render: (row) => (
      <div style={{display:'flex', gap:'0.5rem'}}>
        <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/suppliers/${row.id}/edit`)}>Edit</button>
        <button className="btn btn-sm btn-danger" onClick={() => { setCurrentId(row.id); setConfirmOpen(true); }}>Delete</button>
      </div>
    )}
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Suppliers</h1>
        <button className="btn btn-primary" onClick={() => navigate('/suppliers/new')}>Add Supplier</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <LoadingSpinner /> : <DataTable data={data} columns={columns} />}
      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} message="Delete this supplier?" />
    </div>
  );
};
export default SuppliersPage;
