
import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full bg-green-900 fixed top-0 left-0 h-16 z-50">
      <ul className="flex justify-around items-center h-full">
        <li>
          <NavLink 
            to="/" 
            className={`btn text-white hover:text-yellow-400 transition-colors${
              window.location.pathname === "/" ? " active text-d" : ""
            }`}
          >
            LANDING
          </NavLink>
        </li>
        <li>
          <NavLink
            exact="true"
            to="/home"
            className={`btn text-white hover:text-yellow-500 transition-colors${
              window.location.pathname === "/home" ? " active text-d" : ""
            }`}
          >
            HOME
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/detail" 
            className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-700"
          >
            DETAILS
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/offers" 
            className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-700"
          >
            OFFERS
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
