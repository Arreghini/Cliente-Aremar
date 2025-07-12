import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [showRawData, setShowRawData] = useState(false);

  if (isLoading)
    return (
      <div className="text-center text-neutral-oscuro mt-10">Cargando...</div>
    );
  if (!isAuthenticated) return null;

  return (
    <div className="pt-24 px-4 min-h-screen bg-neutral-oscuro">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-mar-claro">
        {/* Encabezado */}
        <div className="bg-mar-claro text-white py-6 px-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading">Mi Perfil</h1>
            <p className="text-sm font-body">Información personal</p>
          </div>
          <img
            src={user.picture}
            alt={user.name}
            className="w-20 h-20 rounded-full border-4 border-playa-sol shadow-lg"
          />
        </div>

        {/* Contenido */}
        <div className="px-8 py-6 space-y-5 font-body text-neutral-oscuro">
          <div>
            <label className="font-semibold">Nombre completo:</label>
            <p className="text-lg">{user.name}</p>
          </div>

          <div>
            <label className="font-semibold">Email:</label>
            <p className="text-lg">{user.email}</p>
          </div>

          {user.given_name && (
            <div>
              <label className="font-semibold">Nombre:</label>
              <p className="text-lg">{user.given_name}</p>
            </div>
          )}

          {/* Botón para ver JSON */}
          <div className="pt-4">
            <button
              onClick={() => setShowRawData(!showRawData)}
              className="text-sm text-mar-profundo hover:underline"
            >
              {showRawData ? 'Ocultar JSON' : 'Ver JSON completo'}
            </button>

            {showRawData && (
              <div className="bg-neutral-claro p-4 mt-3 rounded-md text-xs text-gray-700 max-h-60 overflow-auto">
                <pre>{JSON.stringify(user, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
