import React from 'react';
import './Card.css';

export const Card = ({ children, className = '', hoverable = false, style = {} }) => {
  return (
    <div className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`} style={style}>
      {children}
    </div>
  );
};
