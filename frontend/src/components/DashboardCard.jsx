import React from 'react';

const DashboardCard = ({ title, value, icon }) => {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div className="card-title">{title}</div>
        <div className="card-value">{value}</div>
      </div>
      <div style={{fontSize: '2rem'}}>{icon}</div>
    </div>
  );
};
export default DashboardCard;
