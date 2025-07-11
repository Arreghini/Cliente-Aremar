import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const NavLinkItem = ({ to, icon, label, onClick, external = false }) => {
  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded" onClick={onClick}>
        {icon}
        <span>{label}</span>
      </a>
    );
  }

  return (
    <NavLink to={to} onClick={onClick} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded">
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};
NavLinkItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  external: PropTypes.bool,
};

export default NavLinkItem;
