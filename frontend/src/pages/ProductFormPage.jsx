import React, { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import FormInput from '../components/FormInput';
import SelectInput from '../components/SelectInput';

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [formData, setFormData] = useState({ name: '', sku: '', description: '', category: '', price: '', cost_price: '', reorder_level: '' });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoriesAPI.getAll().then(res => setCategories(res.data));
    if (isEdit) productsAPI.getById(id).then(res => setFormData(res.data));
  }, [id, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const req = isEdit ? productsAPI.update(id, formData) : productsAPI.create(formData);
    req.then(() => navigate('/products')).catch(console.error);
  };

  return (
    <div style={{maxWidth: '600px'}}>
      <div className="page-header"><h1 className="page-title">{isEdit ? 'Edit Product' : 'Add Product'}</h1></div>
      <form onSubmit={handleSubmit} style={{background: '#fff', padding: '1.5rem', borderRadius: '6px', border: '1px solid #e2e8f0'}}>
        <FormInput label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        <FormInput label="SKU" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} required />
        <FormInput label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        <SelectInput label="Category" options={categories} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
        <FormInput label="Price" type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
        <FormInput label="Cost Price" type="number" step="0.01" value={formData.cost_price} onChange={e => setFormData({...formData, cost_price: e.target.value})} required />
        <FormInput label="Reorder Level" type="number" value={formData.reorder_level} onChange={e => setFormData({...formData, reorder_level: e.target.value})} required />
        <div style={{marginTop: '1.5rem', display: 'flex', gap: '1rem'}}>
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/products')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};
export default ProductFormPage;
