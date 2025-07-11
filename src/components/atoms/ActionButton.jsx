import React from 'react';
import PropTypes from 'prop-types';

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
ActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default ActionButton;
