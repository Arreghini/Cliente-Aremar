import React from "react";
import { FaChevronRight } from "react-icons/fa";

const NextArrow = ({ onClick }) => {
  return (
    <div
      className="slick-arrow slick-next cursor-pointer text-playa-sol hover:text-gray-700 transition 
      duration-300 z-10"
      onClick={onClick}
    >
      <FaChevronRight size={24} />
    </div>
  );
};

export default NextArrow;
