import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [showRawData, setShowRawData] = useState(false);

  if (isLoading) {
    return <div className="text-gray-500 text-center mt-10">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-400 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
        <img
          src={user.picture}
          alt={user.name}
          className="w-24 h-24 rounded-full mx-auto border-4 border-yellow-400"
        />
        <h2 className="text-2xl font-bold mt-4">{user.name}</h2>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-gray-500 text-sm mt-1">{user.given_name}</p>

        <button
          onClick={() => setShowRawData(!showRawData)}
          className="mt-4 text-sm text-yellow-600 hover:text-yellow-800 underline"
        >
          {showRawData ? 'Ocultar detalles' : 'Ver detalles (JSON)'}
        </button>

        {showRawData && (
          <div className="bg-gray-50 rounded mt-3 p-3 text-left text-xs text-gray-700 overflow-auto max-h-60">
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
