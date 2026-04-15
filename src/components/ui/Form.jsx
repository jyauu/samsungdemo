import React from 'react';
import './Form.css';

export const Input = ({ label, id, ...props }) => (
  <div className="form-group">
    {label && <label htmlFor={id} className="form-label">{label}</label>}
    <input id={id} className="form-input" {...props} />
  </div>
);

export const Textarea = ({ label, id, ...props }) => (
  <div className="form-group">
    {label && <label htmlFor={id} className="form-label">{label}</label>}
    <textarea id={id} className="form-textarea" {...props} />
  </div>
);

export const Select = ({ label, id, children, ...props }) => (
  <div className="form-group">
    {label && <label htmlFor={id} className="form-label">{label}</label>}
    <select id={id} className="form-input" {...props}>
      {children}
    </select>
  </div>
);
