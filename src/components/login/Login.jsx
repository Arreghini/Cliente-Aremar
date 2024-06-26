import React, { useState } from 'react';
import Image from '../../assets/toninasVistaPlaya.jfif';
import LogoPlayaSol from '../../assets/logoPlayaSol.png';
import { Icon } from '@fluentui/react';
import LoginB from './LoginButton.jsx';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      console.log('Inicio de sesión exitoso');
      // Aquí puedes redirigir al usuario a otra página o actualizar el estado de la aplicación
    } else {
      console.error('Error en el inicio de sesión');
    }
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-1/3 flex justify-center bg-a items-center">
        <form onSubmit={handleSubmit} className="p-8 rounded shadow-md w-full max-w-sm">
          <h1 className="text-3xl mb-4 text-white font-bold text-center">LOGIN</h1>
          <div className="flex items-center justify-center mb-5">
            <p className="text-xl text-white mr-2">Tus vacaciones empiezan aquí</p>
            <img src={LogoPlayaSol} alt="Logo Playa Sol" className="w-8 h-8" />
          </div>
          <div className="mb-4 relative font-semibold font-serif">
            <Icon iconName="Mail" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
            <input
              type="text"
              id="username"
              value={username}
              placeholder="Username or Email"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 px-3 py-2 bg-gray-300 border rounded"
              required
            />
          </div>
          <div className="mb-6 relative font-semibold font-serif">
            <Icon iconName="Lock" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 px-3 py-2 bg-gray-300 border rounded"
              required
            />
          </div>
          <LoginB />
        </form>
      </div>
      <div className="w-2/3">
        <img src={Image} className="w-full h-full object-cover" alt="Vista de la playa" />
      </div>
    </div>
  );
};

export default Login;
