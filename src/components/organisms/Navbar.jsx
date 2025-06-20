import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/logos/logoSolyMar.png";
import { useAuth0 } from "@auth0/auth0-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import Logout from "../atoms/LogoutButton";
import delfinAnimado from '../../assets/images/delfinAnimado.mp4';

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [showSidebar, setShowSidebar] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [showDelfin, setShowDelfin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef(null);

  const handleLogin = async () => {
    await loginWithRedirect();
  };
  
  useEffect(() => {
    // Redireccion tras login
    const queryParams = new URLSearchParams(location.search);
    const isPaymentFlow =
      location.pathname === "/home" &&
      queryParams.get("status") &&
      queryParams.get("reservationId");

    if (isPaymentFlow) {
      setHasRedirected(true);
      return;
    }
    if (isAuthenticated && !hasRedirected && !isPaymentFlow) {
      navigate("/user");
      setHasRedirected(true);
    }
  }, [isAuthenticated, location.pathname]);

  useEffect(() => {
    const playDolphin = () => {
      setShowDelfin(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
      setTimeout(() => {
        setShowDelfin(false);
      }, 5000);
    };
    // Ejecuta al montar
    playDolphin();
    // Luego cada 5 minutos
    const interval = setInterval(playDolphin, 300000);
    return () => clearInterval(interval);
  }, []);

 return (
  <>
  <div className="relative w-full h-24 bg-white overflow-hidden flex items-center">
  {/* Delfín animado, absolutamente posicionado y detrás */}
  {showDelfin && (
    <video
      ref={videoRef}
      src={delfinAnimado}
      autoPlay
      muted
      playsInline
      className="animate-dolphin h-12"
      style={{ animationDuration: "5s" }}
    />
  )}

  {/* Contenedor icono hamburguesa + logo, siempre en la misma posición */}
  <div className="relative z-30 flex items-center pl-4 space-x-4 w-full">
    <button
      onClick={() => setShowSidebar(true)}
      className="text-3xl md:text-4xl text-blue-800"
    >
      <FontAwesomeIcon icon={faBars} />
    </button>
    <img
      src={Logo}
      alt="Logo SolyMar"
      className="h-16 md:h-20 object-contain"
    />
  </div>
</div>

      {/* Sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowSidebar(false)}
        >
          <div
            className="bg-a w-64 h-full p-4 shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold text-yellow-200 text-lg">Menú</div>
              <button
                onClick={() => setShowSidebar(false)}
                className="text-yellow-100"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <ul className="flex flex-col gap-3">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "text-yellow-500"
                      : "text-yellow-100 hover:text-yellow-400"
                  }
                >
                  Landing
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    isActive
                      ? "text-yellow-500"
                      : "text-yellow-100 hover:text-yellow-400"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/detail"
                  className={({ isActive }) =>
                    isActive
                      ? "text-yellow-500"
                      : "text-yellow-100 hover:text-yellow-400"
                  }
                >
                  Details
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/offers"
                  className={({ isActive }) =>
                    isActive
                      ? "text-yellow-500"
                      : "text-yellow-100 hover:text-yellow-400"
                  }
                >
                  Offers
                </NavLink>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        isActive
                          ? "text-yellow-500"
                          : "text-yellow-100 hover:text-yellow-400"
                      }
                    >
                      Profile
                    </NavLink>
                  </li>
                  <li>
                    <Logout />
                  </li>
                </>
              ) : (
                <li>
                  <button
                    onClick={handleLogin}
                    className="text-yellow-100 hover:text-yellow-400"
                  >
                    Login
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
