import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customersAPI } from '../services/api';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import { Search, UserPlus } from 'lucide-react';

/**
 * ACADEMIC PURPOSE:
 * Displays a list of all customers, provides search filtering using DRF backend SearchFilter,
 * and handles editing and deletion actions with modal confirmation.
 */
const CustomersPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const navigate = useNavigate();

  const loadData = async (query = '') => { 
    setLoading(true); 
    setError(null);
    try {
      const params = query ? { search: query } : {};
      const res = await customersAPI.getAll(params);
      setData(res.data);
    } catch (err) {
      console.error("Error loading customers:", err);
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const handler = setTimeout(() => {
      loadData(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleDelete = async () => { 
    try {
      await customersAPI.delete(currentId);
      loadData(searchTerm);
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
        <div>
          <h1 className="page-title">Customers</h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Manage customer profiles and contact details.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/customers/new')}>
          <UserPlus size={16} style={{ marginRight: '6px' }} /> Add Customer
        </button>
      </div>

      <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2rem' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <LoadingSpinner /> : <DataTable data={data} columns={columns} />}
      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} message="Delete this customer?" />
    </div>
  );
};

export default CustomersPage;
