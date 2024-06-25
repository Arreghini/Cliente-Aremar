import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import DetailView from './views/DetailView';
import HomeView from './views/HomeView';
import OffersView from './views/OffersView';
import LandingView from './views/LandingView';
import Navbar from './components/navbar/Navbar';
import Login from './components/login/Login';
import Profile from './components/profile/Profile'
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { useAuth0 } from '@auth0/auth0-react';

initializeIcons();

function MainLayout() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {location.pathname !== '/login' && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomeView />} />
        <Route path="/detail/:id" element={<DetailView />} />
        <Route path="/offers" element={<OffersView />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

function App() {
  return <MainLayout />;
}

export default App;
