
import React, { useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const User = () => {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    const syncUserWithBackend = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          await axios.post('/api/users', {
            user_id: user.sub,
            email: user.email,
            name: user.name,
            picture: user.picture
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (error) {
          console.error('Error syncing user with backend:', error);
        }
      }
    };

    syncUserWithBackend();
  }, [isAuthenticated, getAccessTokenSilently, user]);

  if (!isAuthenticated) return null;

  return <p>Bienvenido, {user.name}!</p>;
};

export default User;
