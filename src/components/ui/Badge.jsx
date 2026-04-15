import React from 'react';
import './Badge.css';

export const Badge = ({ status, className = '' }) => {
  const normalizedStatus = status.toLowerCase();
  let statusClass = 'badge-pending';
  
  if (normalizedStatus.includes('accept') || normalizedStatus.includes('approv')) statusClass = 'badge-approved';
  else if (normalizedStatus.includes('reject')) statusClass = 'badge-rejected';
  else if (normalizedStatus.includes('change')) statusClass = 'badge-changes';

  return (
    <span className={`badge ${statusClass} ${className}`}>
      {status}
    </span>
  );
};
