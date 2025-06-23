import React from "react";
import { NavLink } from "react-router-dom";

const NavLinkItem = ({ to, icon, label, onClick }) => {
  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-4 rounded-lg font-sans font-semibold text-lg transition-colors duration-200 ${
      isActive ? "text-black" : "text-gray-700 hover:text-blue-700"
    }`;

  return (
    <NavLink to={to} onClick={onClick} className={linkStyle}>
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

export default NavLinkItem;
