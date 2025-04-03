import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../organisms/SearchBar';
import MisReservas from '../atoms/MisReservas';

const Home = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Captura los parámetros de la URL
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');
    const reservationId = queryParams.get('reservationId');

    // Muestra el mensaje basado en el estado del pago
    if (status === 'approved') {
      setMessage(`Reserva Confirmada (ID: ${reservationId})`);
    } else if (status === 'failure') {
      setMessage('El pago ha fallado. Por favor, inténtalo nuevamente.');
    } else if (status === 'pending') {
      setMessage('El pago está pendiente. Por favor, espera la confirmación.');
    }
  }, [location]);

  useEffect(() => {
    if (message) {
      navigate('/home'); 
    }
  }, [message, navigate]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();

          console.log('Token obtenido:', token);
          console.log('Información del usuario:', user);

          const response = await axios.post(
            'http://localhost:3000/api/users/sync', 
            user, 
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.data.isAdmin) {
            setIsAdmin(true);
            console.log('Estado de isAdmin actualizado a true');          
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  const goToDashboard = () => {
    if (isAdmin) {
      window.location.href = 'http://localhost:4000'; // Redirige al dashboard
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 mt-10">
      <h1 className="text-3xl font-bold mb-8 mt-16 text-center">
        Welcome to the Application
      </h1>
      {message && (
        <div className="text-red-500 font-bold text-lg mb-4">
          {message}
        </div>
      )}
      {isAuthenticated && (
        <>
          <p className="text-lg mb-4">
            You are logged in as {user?.name}.
          </p>
          <MisReservas />
          <SearchBar className="search-bar" />
          <button 
            onClick={goToDashboard}
            className={`font-bold py-2 px-4 rounded ${isAdmin ? 'bg-blue-500 hover:bg-blue-700 text-white cursor-pointer' : 
            'bg-gray-400 text-gray-700 cursor-not-allowed'} absolute bottom-14 right-4`}
            disabled={!isAdmin}
          >
            Go to Dashboard
          </button>
        </>
      )}
    </div>
  );
};

export default Home;