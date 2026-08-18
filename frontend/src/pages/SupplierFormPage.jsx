import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { suppliersAPI } from '../services/api';
import FormInput from '../components/FormInput';

/**
 * ACADEMIC PURPOSE:
 * SupplierFormPage component handles both the creation of new suppliers and the editing
 * of existing suppliers. This centralization of logic follows the DRY (Don't Repeat Yourself) principle.
 * 
 * STATE MANAGEMENT:
 * - useState is used for managing the form data and the component's UI states (loading, error, saving).
 * - useEffect is used to fetch the existing supplier data if an 'id' is present in the URL (edit mode).
 * 
 * ERROR HANDLING:
 * - try/catch blocks are implemented in API calls to ensure robust handling of network or server errors,
 *   preventing the application from crashing and providing user feedback.
 */
const SupplierFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchSupplier = async () => {
        try {
          const response = await suppliersAPI.getById(id);
          setFormData(response.data);
        } catch (err) {
          console.error("Error fetching supplier:", err);
          setError("Failed to load supplier details. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      fetchSupplier();
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
        await suppliersAPI.update(id, formData);
      } else {
        await suppliersAPI.create(formData);
      }
      navigate('/suppliers');
    } catch (err) {
      console.error("Error saving supplier:", err);
      setError("Failed to save supplier. Please check your input and try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading supplier data...</div>;

  return (
    <div className="form-page">
      <div className="page-header">
        <h1 className="page-title">{isEditMode ? 'Edit Supplier' : 'Add Supplier'}</h1>
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
          label="Contact Person" 
          name="contact_person"
          value={formData.contact_person} 
          onChange={handleChange} 
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
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/suppliers')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Supplier'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplierFormPage;
