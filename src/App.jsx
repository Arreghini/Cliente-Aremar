import React from 'react';
import { Route, Routes, useLocation, BrowserRouter as Router } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import DetailView from './views/DetailView';
import HomeView from './views/HomeView';
import OffersView from './views/OffersView';
import LandingView from './views/LandingView';
import Navbar from './components/navbar/Navbar';
import Profile from './components/profile/Profile';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import LoginForm from './components/login/LoginForm';

initializeIcons();

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

function MainLayout() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== '/login' && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingView />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<HomeView />} />
        <Route path="/detail/:id" element={<DetailView />} />
        <Route path="/offers" element={<OffersView />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      
        <MainLayout />
      
    </Auth0Provider>
  );
}

export default App;
