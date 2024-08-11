import React from 'react';
import { Route, Routes, useLocation, BrowserRouter as Router } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import DetailView from './views/DetailView';
import HomeView from './views/HomeView';
import OffersView from './views/OffersView';
import LandingView from './views/LandingView';
import Navbar from './components/organisms/Navbar';
import Profile from './components/organisms/Profile';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import User from './components/molecules/User';

initializeIcons();

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;


function MainLayout() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/login' && <Navbar />}
      <main className="pt-20"> {/* Añadir padding-top para evitar que el Navbar cubra el contenido */}
        <Routes>
          <Route path="/" element={<LandingView />} />
          <Route path="/home" element={<HomeView />} />
          <Route path="/detail/:id" element={<DetailView />} />
          <Route path="/offers" element={<OffersView />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
      }}
    >
        <MainLayout />
    </Auth0Provider>
  );
}

export default App;