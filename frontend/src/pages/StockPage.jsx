import React, { useState, useEffect } from 'react';
import { stockAPI } from '../services/api';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

const StockPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLow, setFilterLow] = useState(false);

  useEffect(() => {
    setLoading(true);
    const req = filterLow ? stockAPI.getLow() : stockAPI.getAll();
    req.then(res => { setData(res.data); setLoading(false); });
  }, [filterLow]);

  const columns = [
    { header: 'Product', field: 'name' },
    { header: 'SKU', field: 'sku' },
    { header: 'Category', render: row => row.category_name || row.category },
    { header: 'Current Stock', field: 'stock_quantity' },
    { header: 'Reorder Level', field: 'reorder_level' },
    { header: 'Status', render: row => <StatusBadge status={row.stock_quantity <= row.reorder_level ? 'Low Stock' : 'In Stock'} /> }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Stock Levels</h1>
        <button className={`btn ${filterLow ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilterLow(!filterLow)}>
          {filterLow ? 'Show All' : 'Show Low Stock Only'}
        </button>
      </div>
      {loading ? <LoadingSpinner /> : <DataTable data={data} columns={columns} />}
    </div>
  );
};
export default StockPage;
