import React from 'react';
import PropTypes from 'prop-types';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  canceled: 'bg-red-100 text-red-800',
  default: 'bg-neutral-200 text-neutral-800',
};

const StatusTag = ({ status }) => {
  const style = statusStyles[status] || statusStyles.default;
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium font-body ${style}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
StatusTag.propTypes = {
  status: PropTypes.oneOf(['pending', 'confirmed', 'canceled']).isRequired,
};

export default StatusTag;
