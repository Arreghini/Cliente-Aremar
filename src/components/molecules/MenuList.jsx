import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

import {
  FaBookOpen,
  FaMapMarkedAlt,
  FaStar,
  FaEnvelope,
  FaQuestionCircle,
  FaFileAlt,
  FaTachometerAlt,
} from "react-icons/fa"; 
import NavLinkItem from "../atoms/NavLinkItem";
import logoHome from "../../assets/logos/home2.png"; 
import PropTypes from "prop-types";

const MenuList = ({ onLinkClick }) => {
  const { user, isAuthenticated } = useAuth0();

  // Primero definimos isAdmin
  const isAdmin = isAuthenticated && user && user["https://aremar.com/roles"]?.includes("admin");

  // Luego usamos isAdmin para construir los links
  const links = [
    { to: "/home", icon: <img src={logoHome} alt="Home" className="w-5 h-5" />, label: "Home" },
    { to: "/nuestra-historia", icon: <FaBookOpen />, label: "Nuestra historia" },
    { to: "/map", icon: <FaMapMarkedAlt />, label: "Cómo llegar" },
    { to: "/reviews", icon: <FaStar />, label: "Opiniones" },
    { to: "/help", icon: <FaEnvelope />, label: "Contacto" },
    { to: "/faq", icon: <FaQuestionCircle />, label: "FAQ" },
    { to: "/cancellation", icon: <FaFileAlt />, label: "Política de cancelaciones" },
    ...(isAdmin
      ? [{ to: "http://localhost:4000/dashboard", icon: <FaTachometerAlt />, label: "Dashboard", external: true }]
      : []
    ),
  ];

  return (
    <ul className="flex flex-col gap-2 mt-4 overflow-auto">
      {links.map((link) => (
        <li key={link.to}>
          <NavLinkItem
            to={link.to}
            icon={link.icon}
            label={link.label}
            onClick={onLinkClick}
          />
        </li>
      ))}
    </ul>
  );
};
MenuList.propTypes = {
  onLinkClick: PropTypes.func,
};

export default MenuList;
