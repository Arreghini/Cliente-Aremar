import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import PropTypes from 'prop-types';

const PrevArrow = ({ onClick }) => {
  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 -left-6 
                 cursor-pointer z-10"
      onClick={onClick}
    >
      <FaChevronLeft
        size={28}
        className="text-playa-sol hover:text-gray-700 transition"
      />
    </div>
  );
};
PrevArrow.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default PrevArrow;
