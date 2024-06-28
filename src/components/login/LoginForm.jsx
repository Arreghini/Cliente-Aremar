import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
import LogoPlayaSol from '../../assets/logoPlayaSol.png'; 
import Image from '../../assets/toninasVistaPlaya.jfif';

const LoginForm = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <div className="flex items-center justify-center mb-5">
          <p className="text-xl text-gray-800 mr-2">Tus vacaciones empiezan aquí</p>
          <img src={LogoPlayaSol} alt="Logo Playa Sol" className="w-2/3 h-full" />
        {!isAuthenticated ? (
          <LoginButton />
        ) : (
          <div>
            <h3 className="text-green-500">¡Has iniciado sesión con éxito!</h3>
            <p>Bienvenido, {user.name}</p>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="w-full bg-red-500 text-white p-2 rounded mt-4"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
    <div className="w-2/3">
        <img src={Image} className="w-full h-full object-cover" alt="Vista de la playa" />
      </div>
    </div>
  );
};

export default LoginForm;
