import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const User = () => {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const syncUserWithBackend = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();
          localStorage.setItem('access_token', token); // Guardar token en localStorage
          console.log('Token JWT:', token);

          const userData = {
            user_id: user.sub,
            email: user.email,
            name: user.name,
            picture: user.picture,
          };

          console.log('Sending user data:', userData);

          // Realizar solicitud HTTP al backend
          const response = await axios.post('http://localhost:3000/api/users/sync', userData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log('Backend response:', response.data);
          setLogs((prevLogs) => [...prevLogs, `User data sent to backend: ${user.name}`]);
        } catch (error) {
          console.error('Error syncing user with backend:', error);
          setLogs((prevLogs) => [...prevLogs, `Error syncing user: ${error.message}`]);
        }
      }
    };

    syncUserWithBackend();
  }, [isAuthenticated, getAccessTokenSilently, user]);

  if (!isAuthenticated) return null;

  return (
    <div>
      <p>Bienvenido, {user.name}!</p>
      <div>
        <h3>Console Logs:</h3>
        {logs.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
    </div>
  );
};

export default User;
