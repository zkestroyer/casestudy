import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { customersAPI } from '../services/api';
import FormInput from '../components/FormInput';

/**
 * ACADEMIC PURPOSE:
 * CustomerFormPage component handles both the creation of new customers and the editing
 * of existing customers.
 * 
 * STATE MANAGEMENT:
 * - useState handles local form data, providing instant feedback without mutating global state.
 * - useEffect fetches data when the component mounts if an ID parameter is detected in the route.
 * 
 * ERROR HANDLING:
 * - try/catch constructs wrap asynchronous API requests (using async/await). This ensures that
 *   network failures or server validation errors are caught and surfaced to the user.
 */
const CustomerFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchCustomer = async () => {
        try {
          const response = await customersAPI.getById(id);
          setFormData(response.data);
        } catch (err) {
          console.error("Error fetching customer:", err);
          setError("Failed to load customer details. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      fetchCustomer();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (isEditMode) {
        await customersAPI.update(id, formData);
      } else {
        await customersAPI.create(formData);
      }
      navigate('/customers');
    } catch (err) {
      console.error("Error saving customer:", err);
      setError("Failed to save customer. Please check your input and try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading customer data...</div>;

  return (
    <div className="form-page">
      <div className="page-header">
        <h1 className="page-title">{isEditMode ? 'Edit Customer' : 'Add Customer'}</h1>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit} className="form-container">
        <FormInput 
          label="Name" 
          name="name"
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
        <FormInput 
          label="Email" 
          name="email"
          type="email"
          value={formData.email} 
          onChange={handleChange} 
        />
        <FormInput 
          label="Phone" 
          name="phone"
          value={formData.phone} 
          onChange={handleChange} 
        />
        <FormInput 
          label="Address" 
          name="address"
          value={formData.address} 
          onChange={handleChange} 
        />
        <div className="form-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/customers')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Customer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerFormPage;
