import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const User = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const sendUserInfo = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          const response = await axios.post('http://localhost:3000/api/users/sync', user, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('User info sent successfully:', response.data);
        } catch (error) {
          console.error('Error sending user info:', error);
        }
      }
    };

    sendUserInfo();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  if (!isAuthenticated) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <p className="font-bold text-gray-700 text-sm mb-2">Name:</p>
          <p className="text-gray-700">{user.name}</p>
        </div>
        <div className="mb-4">
          <p className="font-bold text-gray-700 text-sm mb-2">Email:</p>
          <p className="text-gray-700">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default User;
