import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../services/api';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import ConfirmDialog from '../components/ConfirmDialog';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const loadData = () => { setLoading(true); categoriesAPI.getAll().then(res => { setCategories(res.data); setLoading(false); }); };
  useEffect(() => { loadData(); }, []);

  const handleSave = () => {
    if (currentId) categoriesAPI.update(currentId, formData).then(() => { setModalOpen(false); loadData(); });
    else categoriesAPI.create(formData).then(() => { setModalOpen(false); loadData(); });
  };
  const handleDelete = () => { categoriesAPI.delete(currentId).then(() => loadData()); };

  const columns = [
    { header: 'Name', field: 'name' },
    { header: 'Description', field: 'description' },
    { header: 'Actions', render: (row) => (
      <div style={{display:'flex', gap:'0.5rem'}}>
        <button className="btn btn-sm btn-secondary" onClick={() => { setCurrentId(row.id); setFormData({name: row.name, description: row.description}); setModalOpen(true); }}>Edit</button>
        <button className="btn btn-sm btn-danger" onClick={() => { setCurrentId(row.id); setConfirmOpen(true); }}>Delete</button>
      </div>
    )}
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        <button className="btn btn-primary" onClick={() => { setCurrentId(null); setFormData({name:'', description:''}); setModalOpen(true); }}>Add Category</button>
      </div>
      {loading ? <LoadingSpinner /> : <DataTable data={categories} columns={columns} />}
      
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={currentId ? "Edit Category" : "Add Category"} footer={
        <><button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Save</button></>
      }>
        <FormInput label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        <FormInput label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
      </Modal>

      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} message="Are you sure you want to delete this category?" />
    </div>
  );
};
export default CategoriesPage;
