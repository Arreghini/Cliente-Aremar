import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Home = () => {
  const { user, isAuthenticated } = useAuth0();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 mt-10">
      <h1 className="text-3xl font-bold mb-8 mt-16 text-center">
        Welcome to the Application
      </h1>
      <p className="text-lg">
        You are logged in as {user?.name}.
      </p>
    </div>
  );
};

export default Home;
