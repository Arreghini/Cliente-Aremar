import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Logo from "../atoms/Logo";
import MenuButton from "../atoms/MenuButton";
import TopMenuButton from "../atoms/TopMenuButton";
import SideMenu from "../molecules/SideMenu";

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [showMenu, setShowMenu] = useState(false);
 
  return (
    <div className="fixed top-0 left-0 w-full flex items-center h-16 bg-transparent z-30">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Izquierda: Menu hamburguesa + Logo */}
        <div className="top-16 left-12 relative flex items-center space-x-4 z-30">
          <MenuButton isOpen={showMenu} onClick={() => setShowMenu(!showMenu)} />
          <Logo />
        </div>

        {/* Derecha: Menú Top */}
        <div className="relative flex items-center top-4 space-x-4 z-30">          
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
