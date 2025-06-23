import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Logo from "../atoms/Logo";
import MenuButton from "../atoms/MenuButton";
import TopMenuButton from "../atoms/TopMenuButton";
import SideMenu from "../molecules/SideMenu";
import DolphinAnimation from "../atoms/DolphinAnimation";

const DELFIN_DURATION = 30000;

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [showMenu, setShowMenu] = useState(false);
  const [showDelfin, setShowDelfin] = useState(false);

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

  return (
   <div className="relative w-full z-40 flex items-center h-40 px-8 bg-white shadow-md" style={{ top: '-10px' }}>
 {showDelfin && (
  <DolphinAnimation className="absolute left-0 h-10 pointer-events-none animate-dolphin" style={{ top: "11rem" }} />
)}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Izquierda: Menu hamburguesa + Logo */}
        <div className="top-4 relative flex items-center space-x-4 z-30">
          <MenuButton isOpen={showMenu} onClick={() => setShowMenu(!showMenu)} />
          <Logo />
        </div>

        {/* Derecha: Menú Top */}
        <div className="relative flex items-center space-x-4 z-30" style={{ top: '-20px' }}>          
          <TopMenuButton />
        </div>
      </div>

      <SideMenu
        isOpen={showMenu}
        isAuthenticated={isAuthenticated}
        onLogin={loginWithRedirect}
        onLogout={logout}
        onClose={() => setShowMenu(false)}
      />
    </div>
  );
};

export default Navbar;
