import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <div>Para definir el profile debe loguearse primero</div>;
  }

  return (
    <div className="flex justify-center mt-4">
      <div className="w-full max-w-xs bg-blue-200 text-black font-semibold text-xl py-4 px-4 rounded flex flex-col items-center">
        <img className="w-24 h-24 rounded-full mb-4" src={user.picture} alt={user.name} />
        <h2 className="text-lg mb-2">{user.name}</h2>
        <p className="text-sm">{user.email}</p> 
      </div>
    </div>
  );
};

export default Profile;
