import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/logoSolyMar.png";

const Navbar = () => {
  return (
    <nav className="w-full bg-blue-900 fixed top-0 left-0  z-50 flex items-center">
      <div className="flex items-center">
        <img 
        src={Logo} 
        alt="Logo Sol y Mar" 
        className="h-20 ml-4" />
      </div>
      <ul className="flex justify-around items-center w-full h-full">
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive 
              ? "btn text-yellow-500 transition-colors"
              : "btn text-yellow-100 hover:text-yellow-400 transition-colors"}
          >
            LANDING
          </NavLink>
        </li>
        <li>
        <NavLink
            exact
            to="/home"
            className={({ isActive }) => isActive 
            ? "btn text-yellow-500 transition-colors"
            : "btn text-yellow-100 hover:text-yellow-400 transition-colors"}
          >
            HOME
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/detail" 
            className={({ isActive }) => isActive 
            ? "btn text-yellow-500 transition-colors"
            : "btn text-yellow-100 hover:text-yellow-400 transition-colors"}
          >
            DETAILS
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/offers" 
            className={({ isActive }) => isActive 
            ? "btn text-yellow-500 transition-colors"
            : "btn text-yellow-100 hover:text-yellow-400 transition-colors"}
          >
            OFFERS
          </NavLink>
        </li>
        <li>
        <NavLink 
            to="/login" 
            className={({ isActive }) => isActive 
            ? "btn text-yellow-500 transition-colors"
            : "btn text-yellow-100 hover:text-yellow-400 transition-colors"}
          >
            LOGIN
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
