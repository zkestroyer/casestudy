import React from 'react';

const StatusBadge = ({ status }) => {
  let badgeClass = 'badge-default';
  const lowerStatus = status?.toLowerCase();
  if (['confirmed', 'completed', 'paid', 'delivered'].includes(lowerStatus)) badgeClass = 'badge-success';
  if (['pending', 'draft', 'low stock'].includes(lowerStatus)) badgeClass = 'badge-warning';
  if (['cancelled', 'out of stock'].includes(lowerStatus)) badgeClass = 'badge-danger';
  if (['processing', 'shipped'].includes(lowerStatus)) badgeClass = 'badge-info';

  return <span className={`badge ${badgeClass}`}>{status}</span>;
};
export default StatusBadge;
