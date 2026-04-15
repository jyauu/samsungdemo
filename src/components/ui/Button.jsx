import React from 'react';
import './Button.css';

export const Button = ({ children, variant = 'primary', className = '', fullWidth, ...props }) => {
  const classes = `btn btn-${variant} ${fullWidth ? 'btn-full' : ''} ${className}`;
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
