import React, { useState } from 'react';
import Image from '../../assets/toninasVistaPlaya.jfif';
import { Icon } from '@fluentui/react'; 

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

    const data = await response.json();
    if (data.success) {
      console.log('Inicio de sesión exitoso');
    } else {
      console.error('Error en el inicio de sesión');
    }
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-1/3 flex justify-center bg-blue-900 items-center">
        <form onSubmit={handleSubmit} className="p-8 rounded shadow-md w-full max-w-sm">
          <h1 className="text-3xl mb-4 text-white font-bold text-center">LOGIN</h1>
          <p className="text-xl mb-5 text-white text-center">Tus vacaciones empiezan aquí</p>
          <div className="mb-4 relative">
            <Icon iconName="Mail" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
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
          <div className="mb-6 relative">
            <Icon iconName="Lock" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
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
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="w-1/3 justify-center bg-yellow-400 text-white py-2 px-4 rounded hover:bg-yellow-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="w-2/3">
        <img src={Image} className="w-full h-full object-cover" alt="Vista de la playa" />
      </div>
    </div>
  );
};

export default Login;
