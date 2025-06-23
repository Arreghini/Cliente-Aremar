import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faTag,
  faUserCircle,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons"; 
import MisReservas from "../../components/atoms/MisReservas";
import { useAuth0 } from "@auth0/auth0-react"; 

const TopMenuButton = ({ className }) => {
  const { isAuthenticated } = useAuth0();
  const [showMisReservas, setShowMisReservas] = useState(false);

  const buttonStyle = `relative flex items-center gap-2 px-4 py-2 rounded-lg font-poppins text-lg transition-colors 
    duration-200 ${className}`;

  return (
    <>
      {isAuthenticated ? (
        <div className="relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowMisReservas(!showMisReservas);
            }}
            className={`${buttonStyle} text-gray-700 hover:text-blue-700`}
          >
            <FontAwesomeIcon icon={faCalendarCheck} />
            <span>Mis Reservas</span>
          </button>

          {showMisReservas && (
            <div
              className="
                fixed top-24 left-1/2 transform -translate-x-1/2 
                w-[75vw] p-4 rounded-lg bg-white shadow-2xl border border-gray-200 
                z-50
              "
            >
              <MisReservas />
            </div>
          )}
        </div>
      ) : (
        <div className={`${buttonStyle} text-gray-400 cursor-not-allowed`}>
          <FontAwesomeIcon icon={faCalendarCheck} />
          <span>Mis Reservas</span>
        </div>
      )}

      <NavLink to="/offers" className={`${buttonStyle} text-gray-700 hover:text-blue-700`}>
        <FontAwesomeIcon icon={faTag} />
        <span>Promociones</span>
      </NavLink>

      <NavLink to="/miPerfil" className={`${buttonStyle} text-gray-700 hover:text-blue-700`}>
        <FontAwesomeIcon icon={faUserCircle} />
        <span>Mi Perfil</span>
      </NavLink>

      <NavLink to="/login" className={`${buttonStyle} text-gray-700 hover:text-blue-700`}>
        <FontAwesomeIcon icon={faRightToBracket} />
        <span>Login</span>
      </NavLink>
    </>
  );
};

export default TopMenuButton;
