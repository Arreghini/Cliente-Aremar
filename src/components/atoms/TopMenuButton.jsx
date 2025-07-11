import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faTag,
  faUserCircle,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import MisReservas from "../../components/atoms/MisReservas";
import LoginButton from "../../components/atoms/LoginButton";
import LogoutButton from "../../components/atoms/LogoutButton";
import LogoHome from "../../assets/logos/home.png";
import { useAuth0 } from "@auth0/auth0-react";
import PropTypes from "prop-types";

const TopMenuButton = ({ className }) => {
  const { isAuthenticated } = useAuth0();
  const [showMisReservas, setShowMisReservas] = useState(false);
  const modalRef = useRef(null);

  // 🔁 Detecta clics fuera del modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setShowMisReservas(false);
      }
    };

    if (showMisReservas) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMisReservas]);

  const buttonBase = `relative flex items-center gap-2 px-4 py-2 rounded-lg font-poppins text-lg transition-colors duration-200 ${className} hover:text-yellow-300 text-white`;

  return (
    <>
      {/* Logo estático */}
      <NavLink to="/home" className="mr-4">
        <img
          src={LogoHome}
          alt="Logo Aremar"
          className="w-6 h-6 object-contain"
        />
      </NavLink>

      {/* Botón "Mis Reservas" */}
      {isAuthenticated ? (
        <div className="relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowMisReservas(!showMisReservas);
            }}
            className={buttonBase}
          >
            <FontAwesomeIcon icon={faCalendarCheck} />
            <span>Mis Reservas</span>
          </button>

          {showMisReservas && (
            <div
              ref={modalRef}
              className="fixed top-24 left-1/2 transform -translate-x-1/2 
              w-[75vw] p-4 rounded-lg bg-white shadow-2xl border border-gray-200 z-50"
            >
              <MisReservas />
            </div>
          )}
        </div>
      ) : (
        <div className={`${buttonBase} opacity-50 cursor-not-allowed`}>
          <FontAwesomeIcon icon={faCalendarCheck} />
          <span>Mis Reservas</span>
        </div>
      )}

      {/* Botones de navegación */}
      <NavLink to="/offers" className={buttonBase}>
        <FontAwesomeIcon icon={faTag} />
        <span>Promociones</span>
      </NavLink>

      <NavLink to="/profile" className={buttonBase}>
        <FontAwesomeIcon icon={faUserCircle} />
        <span>Mi Perfil</span>
      </NavLink>

      {!isAuthenticated && (
        <div className={buttonBase}>
          <FontAwesomeIcon icon={faRightToBracket} />
          <LoginButton />
        </div>
      )}

      {isAuthenticated && (
        <div className={buttonBase}>
          <FontAwesomeIcon icon={faRightToBracket} />
          <LogoutButton />
        </div>
      )}
    </>
  );
};
TopMenuButton.propTypes = {
  className: PropTypes.string,
};

export default TopMenuButton;
