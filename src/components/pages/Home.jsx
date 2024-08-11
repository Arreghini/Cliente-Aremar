import React from 'react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 mt-16 text-center">Welcome to the Application</h1>
      <a href="http://localhost:4000">
        <button className="bg-yellow-500 text-white font-semibold text-xl py-2 px-6 rounded-lg shadow-md hover:bg-yellow-600 transition-colors">
          Go to Dashboard
        </button>
      </a>
    </div>
  );
};

export default Home;
