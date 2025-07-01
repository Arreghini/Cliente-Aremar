
import React from "react";
import { FaChevronLeft } from "react-icons/fa";

const PrevArrow = ({ onClick }) => {
  return (
    <div
      className="slick-arrow slick-prev cursor-pointer text-playa-sol hover:text-gray-700 transition 
      duration-300 z-10"
      onClick={onClick}
    >
      <FaChevronLeft size={24} />
    </div>
  );
};

export default PrevArrow;
