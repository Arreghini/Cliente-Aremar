import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/logos/logoSolyMar.png";
import { useAuth0 } from "@auth0/auth0-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  FaHome,
  FaBookOpen,
  FaMapMarkedAlt,
  FaStar,
  FaEnvelope,
  FaQuestionCircle,
  FaFileAlt,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import Logout from "../atoms/LogoutButton";
import delfinAnimado from "../../assets/images/delfinAnimado.mp4";

const DELFIN_DURATION = 30000;

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [showMenu, setShowMenu] = useState(false);
  const [showDelfin, setShowDelfin] = useState(false);
  const videoRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    let timeout;
    const playDolphin = () => {
      setShowDelfin(false);
      setTimeout(() => setShowDelfin(true), 50);
      timeout = setTimeout(() => setShowDelfin(false), DELFIN_DURATION);
    };
    playDolphin();
    const interval = setInterval(playDolphin, 5 * 60 * 1000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleLogin = async () => {
    await loginWithRedirect();
  };
  
  const linkStyle = ({ isActive }) =>
    "font-sans text-xl flex items-center space-x-3 text-gray-700 hover:text-blue-500";

  return (
    <div className="relative w-full h-24 bg-white flex items-center z-40">
      {showDelfin && (
        <video
          key={showDelfin}
          ref={videoRef}
          src={delfinAnimado}
          autoPlay
          muted
          playsInline
          className="animate-dolphin h-8 absolute top-1 left-0 pointer-events-none"
          style={{ animationDuration: "5s", zIndex: 10 }}
        />
      )}
      <div className="relative z-30 flex items-center pl-4 space-x-4">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-3xl md:text-4xl text-blue-800 focus:outline-none"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <img
          src={Logo}
          alt="Logo SolyMar"
          className="h-16 md:h-20 object-contain"
        />
      </div>

      {/* Menú deslizante */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-screen w-1/4 bg-white rounded-r-lg shadow-lg border-r border-gray-200 z-50 flex flex-col p-4 transform transition-transform duration-300 ${showMenu ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-end">
          <button
            onClick={() => setShowMenu(false)}
            className="text-gray-400 hover:text-gray-700 text-2xl"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <ul className="flex flex-col gap-5 mt-4">
          <li>
            <NavLink to="/home" onClick={() => setShowMenu(false)} className={linkStyle}>
              <FaHome />
              <span>Volvamos a la Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/nuestraHistoria" onClick={() => setShowMenu(false)} className={linkStyle}>
              <FaBookOpen />
              <span>Nuestra historia</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/map" onClick={() => setShowMenu(false)} className={linkStyle}>
              <FaMapMarkedAlt />
              <span>Cómo llegar</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/reviews" onClick={() => setShowMenu(false)} className={linkStyle}>
              <FaStar />
              <span>Opiniones</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/help" onClick={() => setShowMenu(false)} className={linkStyle}>
              <FaEnvelope />
              <span>Contacto</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/faq" onClick={() => setShowMenu(false)} className={linkStyle}>
              <FaQuestionCircle />
              <span>FAQ</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/policiesCancellation" onClick={() => setShowMenu(false)} className={linkStyle}>
              <FaFileAlt />
              <span>Política de cancelaciones</span>
            </NavLink>
          </li>
          {!isAuthenticated ? (
            <li>
              <button
                onClick={handleLogin}
                className="font-sans text-xl flex items-center space-x-3 text-gray-700 hover:text-blue-500"
              >
                <FaSignInAlt />
                <span>Login</span>
              </button>
            </li>
          ) : (
            <li>
              <Logout>
                <div className="font-sans text-xl flex items-center space-x-3 text-gray-700 hover:text-blue-500">
                  <FaSignOutAlt />
                  <span>Salir</span>
                </div>
              </Logout>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
