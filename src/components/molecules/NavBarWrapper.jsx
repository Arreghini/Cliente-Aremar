import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import TopMenuButton from "../atoms/TopMenuButton";
import SideMenu from "../molecules/SideMenu";
import MenuButton from "../atoms/MenuButton";
import Logo from "../atoms/Logo";

const NavBarWrapper = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false);
        setShowMenu(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-500 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="relative w-full h-32 max-w-7xl mx-auto">
          {/* Logo + Hamburguesa más abajo (por ejemplo, 40px del top) */}
          <div className="absolute left-4 top-8 flex items-center space-x-4">
            <MenuButton isOpen={showMenu} onClick={() => setShowMenu(!showMenu)} />
            <Logo />
          </div>

          {/* TopMenu botones bien arriba a la derecha */}
          <div className="absolute right-4 top-2 flex items-center space-x-4">
            <TopMenuButton />
          </div>
        </div>
      </div>

      {showNavbar && (
        <SideMenu
          isOpen={showMenu}
          isAuthenticated={isAuthenticated}
          onLogin={loginWithRedirect}
          onLogout={logout}
          onClose={() => setShowMenu(false)}
        />
      )}
    </>
  );
};

export default NavBarWrapper;
