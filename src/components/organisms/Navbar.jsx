import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/logos/logoSolyMar.png";
import { useAuth0 } from "@auth0/auth0-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Logout from "../atoms/LogoutButton"; 

const Navbar = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async () => {
    await loginWithRedirect();
  };

   useEffect(() => {
    // Verificamos si estamos en la ruta de pago
    const queryParams = new URLSearchParams(location.search);
    const isPaymentFlow = location.pathname === "/home" && 
                         queryParams.get("status") && 
                         queryParams.get("reservationId");

    // Si estamos en el flujo de pago, actualizamos el estado para evitar redirecciones
    if (isPaymentFlow) {
        setHasRedirected(true);
        return;
    }

    // Solo redirigimos si no estamos en el flujo de pago
    if (isAuthenticated && !hasRedirected && !isPaymentFlow) {
        navigate("/user");
        setHasRedirected(true);
    }
}, [isAuthenticated, location.pathname]);  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full bg-a fixed top-0 left-0 z-50 flex items-center">
      <div className="flex items-center">
        <img src={Logo} alt="Logo Sol y Mar" className="h-20 ml-4" />
      </div>
      <ul className="flex justify-around items-center w-full h-full">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "btn text-yellow-500 transition-colors"
                : "btn text-yellow-100 hover:text-yellow-400 transition-colors"
            }
          >
            LANDING
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive
                ? "btn text-yellow-500 transition-colors"
                : "btn text-yellow-100 hover:text-yellow-400 transition-colors"
            }
          >
            HOME
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/detail"
            className={({ isActive }) =>
              isActive
                ? "btn text-yellow-500 transition-colors"
                : "btn text-yellow-100 hover:text-yellow-400 transition-colors"
            }
          >
            DETAILS
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/offers"
            className={({ isActive }) =>
              isActive
                ? "btn text-yellow-500 transition-colors"
                : "btn text-yellow-100 hover:text-yellow-400 transition-colors"
            }
          >
            OFFERS
          </NavLink>
        </li>
        {isAuthenticated ? (
          <li className="relative">
            <div className="flex items-center cursor-pointer text-white" onClick={toggleMenu}>
              <img className="w-10 h-10 rounded-full" src={user.picture} alt={user.name} />
              <span className="ml-2">Hi, {user.given_name}</span>
              <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
            </div>
            {isMenuOpen && (
              <ul className="absolute left-0 mt-2 w-48 bg-a border border-gray-200 rounded-md shadow-lg text-white">
                <li className="px-4 py-2 cursor-pointer text-yellow-200 hover:text-yellow-500 transition-colors">
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      isActive ? " text-yellow-200 hover:text-yellow-500 transition-colors" : ""
                    }
                  >
                    Profile
                  </NavLink>
                </li>
                <li className="px-4 py-2 cursor-pointer text-yellow-200 hover:text-yellow-500 transition-colors">
                  <Logout />
                </li>
              </ul>
            )}
          </li>
        ) : (
          <li>
            <button
              onClick={handleLogin}
              className="btn text-yellow-100 hover:text-yellow-400 transition-colors"
            >
              LOGIN
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
