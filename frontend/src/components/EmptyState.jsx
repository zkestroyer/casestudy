import React from 'react';
import { FileQuestion } from 'lucide-react';

const EmptyState = ({ icon: Icon = FileQuestion, title, description, action }) => {
  return (
    <div className="empty-state">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#94a3b8' }}>
        <Icon size={48} strokeWidth={1.5} />
      </div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: action ? '1.5rem' : '0', maxWidth: '300px', margin: '0 auto' }}>
        {description}
      </p>
      {action && (
        <div style={{ marginTop: '1.5rem' }}>
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
