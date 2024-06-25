import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div className="flex items-center justify-center h-screen">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4">
            <img
              src={user.picture}
              alt={user.name}
              className="w-24 h-24 rounded-full mx-auto"
            />
            <div className="text-center mt-4">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p>{user.given_name}</p>
              
            </div>
            <div>
  <pre>{JSON.stringify(user, null, 2)}</pre>
</div>
       </div>
        </div>
      </div>
    )
  );
};

export default Profile;
