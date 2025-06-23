import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../organisms/SearchBar';
import MisReservas from '../atoms/MisReservas';
import PaymentStatus from '../atoms/PaymentStatus';

const Home = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();
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
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      }
    };
    checkAdminStatus();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get('status');
  const reservationId = queryParams.get('reservationId');

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-1 p-4 flex flex-col items-center gap-4">
        <SearchBar />
      </main>
    </div>
  );
};

export default Home;
