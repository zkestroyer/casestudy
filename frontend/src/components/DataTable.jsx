import React from 'react';

const DataTable = ({ columns, data, keyField = 'id' }) => {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? data.map((row) => (
            <tr key={row[keyField]}>
              {columns.map((col, idx) => (
                <td key={idx}>{col.render ? col.render(row) : row[col.field]}</td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length} style={{textAlign: 'center', padding: '2rem'}}>No records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default DataTable;
