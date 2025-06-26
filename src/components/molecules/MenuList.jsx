import React from "react";
import {
  FaHome,
  FaBookOpen,
  FaMapMarkedAlt,
  FaStar,
  FaEnvelope,
  FaQuestionCircle,
  FaFileAlt,
  FaTachometerAlt,
} from "react-icons/fa"; 
import NavLinkItem from "../atoms/NavLinkItem";

const MenuList = ({ onLinkClick, isAdmin }) => {
  const links = [
    { to: "/home", icon: <FaHome />, label: "Volvamos a la Home" },
    { to: "/nuestraHistoria", icon: <FaBookOpen />, label: "Nuestra historia" },
    { to: "/map", icon: <FaMapMarkedAlt />, label: "Cómo llegar" },
    { to: "/reviews", icon: <FaStar />, label: "Opiniones" },
    { to: "/help", icon: <FaEnvelope />, label: "Contacto" },
    { to: "/faq", icon: <FaQuestionCircle />, label: "FAQ" },
    { to: "/policiesCancellation", icon: <FaFileAlt />, label: "Política de cancelaciones" },
    ...(isAdmin
      ? [{ to: "/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" }]
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

export default MenuList;
