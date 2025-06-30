import React from 'react';

const ActionButton = ({ onClick, children, className = '', type = 'button' }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`bg-mar-profundo hover:bg-mar-claro text-white font-heading px-4 py-2 rounded-xl shadow transition ${className}`}
    >
      {children}
    </button>
  );
};

export default ActionButton;
