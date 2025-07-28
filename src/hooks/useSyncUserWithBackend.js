// src/hooks/useSyncUserWithBackend.js
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const useSyncUserWithBackend = () => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const syncUser = async () => {
      try {
        console.log('🟡 Obteniendo token para sincronización...');
        const token = await getAccessTokenSilently();

        console.log('🟢 Token obtenido:', token);
        console.log('🟡 Usuario a sincronizar:', user);

        await axios.post(
  'http://localhost:3000/api/users/sync',
  {
    auth0Id: user.sub,
    name: user.name,
    email: user.email,
    emailVerified: user.email_verified,
    picture: user.picture,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

        console.log('🟢 Usuario sincronizado correctamente');
      } catch (error) {
        console.error('🔴 Error al sincronizar usuario:', error);
      }
    };

    if (isAuthenticated && user) {
      syncUser();
    }
  }, [isAuthenticated, user, getAccessTokenSilently]);
};

export default useSyncUserWithBackend;
