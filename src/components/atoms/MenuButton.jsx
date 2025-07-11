import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const MenuButton = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    className="text-3xl md:text-4xl text-white hover:text-yellow-400 focus:outline-none"
  >
    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
  </button>
);
MenuButton.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MenuButton;
