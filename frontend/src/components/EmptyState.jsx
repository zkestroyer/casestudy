import React from 'react';

const EmptyState = ({ message = "No data available" }) => (
  <div className="empty-state">
    <p>{message}</p>
  </div>
);
export default EmptyState;
