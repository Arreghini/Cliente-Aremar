// LoginForm.jsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import LoginButton from '../atoms/LoginButton';
import LogoPlayaSol from '../../assets/logos/logoPlayaSol.png'; 
import Image from '../../assets/images/PlayaToninas.jpg';

const LoginForm = () => {
  const { logout, isAuthenticated, user } = useAuth0(); // Agregado nuevamente
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/user');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-a">
      <div className="flex flex-col items-center justify-center w-1/3">
        <div className="text-center mb-5">
          <p className="text-xl text-white">Tus vacaciones empiezan aquí</p>
          <img src={LogoPlayaSol} alt="Logo Playa Sol" className="mt-5 w-8 h-8 mx-auto" />
        </div>
        {!isAuthenticated ? (
          <LoginButton />
        ) : (
          <div className="text-center">
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
      <div className="w-2/3 h-screen overflow-hidden">
        <img src={Image} className="w-full h-full object-cover" alt="Vista de la playa" />
      </div>
    </div>
  );
};

export default LoginForm;
