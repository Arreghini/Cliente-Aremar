import React from "react";

const AuthButton = ({ isAuthenticated, onLogin, onLogout }) => {
  const baseStyle =
    "flex items-center gap-3 px-4 py-2 rounded-lg font-poppins text-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 w-full";

  return isAuthenticated ? (
    <button onClick={onLogout} className={baseStyle}>
      Salir
    </button>
  ) : (
    <button onClick={onLogin} className={baseStyle}>
      Login
    </button>
  );
};

export default AuthButton;
