import React, { useState } from 'react';
import Image from '../../assets/toninasVistaPlaya.jfif';

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
      // Manejar el éxito del inicio de sesión
      console.log('Inicio de sesión exitoso');
    } else {
      // Manejar el error del inicio de sesión
      console.error('Error en el inicio de sesión');
    }
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-1/3 flex justify-center bg-blue-300 items-center">
        <form onSubmit={handleSubmit} className="p-8 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl mb-6 text-center">INICIO DE SESIÓN</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-center" htmlFor="username">USER</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 text-center" htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="w-2/3">
        <img src={Image} className="w-full h-full object-cover" alt="Vista de la playa" />
      </div>
    </div>
  );
};

export default Login;
