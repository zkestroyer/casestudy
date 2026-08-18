import React, { useState, useEffect } from 'react';
import { customersAPI, productsAPI, ordersAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import SelectInput from '../components/SelectInput';
import FormInput from '../components/FormInput';

const OrderCreatePage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ product: '', quantity: 1, unit_price: '' }]);

  useEffect(() => {
    customersAPI.getAll().then(res => setCustomers(res.data));
    productsAPI.getAll().then(res => setProducts(res.data));
  }, []);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'product') {
      const prod = products.find(p => p.id === parseInt(value));
      if (prod) newItems[index].unit_price = prod.price;
    }
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { product: '', quantity: 1, unit_price: '' }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const total = items.reduce((sum, item) => sum + (parseFloat(item.quantity||0) * parseFloat(item.unit_price||0)), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    ordersAPI.create({ 
      customer: customerId, 
      items: items.filter(i => i.product),
      order_date: new Date().toISOString().split('T')[0]
    })
      .then(() => navigate('/orders')).catch(console.error);
  };

  return (
    <div style={{maxWidth: '800px'}}>
      <div className="page-header"><h1 className="page-title">Create Order</h1></div>
      <form onSubmit={handleSubmit} style={{background: '#fff', padding: '1.5rem', borderRadius: '6px', border: '1px solid #e2e8f0'}}>
        <SelectInput label="Customer" options={customers} value={customerId} onChange={e => setCustomerId(e.target.value)} required />
        
        <div style={{marginTop: '1.5rem', marginBottom: '1rem'}}>
          <h4>Line Items</h4>
          {items.map((item, idx) => (
            <div key={idx} style={{display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1rem'}}>
              <div style={{flex: 2}}>
                <SelectInput label="Product" options={products} value={item.product} onChange={e => handleItemChange(idx, 'product', e.target.value)} required />
              </div>
              <div style={{flex: 1}}>
                <FormInput label="Quantity" type="number" min="1" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', e.target.value)} required />
              </div>
              <div style={{flex: 1}}>
                <FormInput label="Unit Price" type="number" step="0.01" value={item.unit_price} onChange={e => handleItemChange(idx, 'unit_price', e.target.value)} required />
              </div>
              <div style={{marginBottom: '1rem'}}>
                <button type="button" className="btn btn-danger" onClick={() => removeItem(idx)}>X</button>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}>+ Add Item</button>
        </div>
        
        <div style={{fontSize: '1.25rem', fontWeight: 600, textAlign: 'right'}}>Subtotal: ${total.toFixed(2)}</div>
        
        <div style={{marginTop: '1.5rem', display: 'flex', gap: '1rem'}}>
          <button type="submit" className="btn btn-primary">Create Order</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/orders')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};
export default OrderCreatePage;
