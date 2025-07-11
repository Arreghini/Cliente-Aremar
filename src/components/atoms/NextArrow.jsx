import React from "react";
import { FaChevronRight } from "react-icons/fa";
import PropTypes from "prop-types";

const NextArrow = ({ onClick }) => {
  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 -right-6 
                 cursor-pointer z-10"
      onClick={onClick}
    >
      <FaChevronRight size={28} className="text-playa-sol hover:text-gray-700 transition" />
    </div>
  );
};
NextArrow.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default NextArrow;
