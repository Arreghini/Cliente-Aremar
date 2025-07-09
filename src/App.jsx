import React from 'react';
import { Route, Routes, useLocation, BrowserRouter as Router } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import HomeView from './views/HomeView';
import OffersView from './views/OffersView';
import LandingView from './views/LandingView';
import Navbar from './components/organisms/Navbar';
import Profile from './components/organisms/Profile';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import User from './components/molecules/User';
import SearchBar from './components/organisms/SearchBar';
import ReservationPage from './components/pages/ReservationPage';
import PaymentStatus from './components/atoms/PaymentStatus';
import FaqPage from './components/pages/FaqPage';
import HowToArrive from './components/pages/HowToArrive';
import NuestraHistoria from './components/pages/NuestraHistoria';
import Contacto from './components/pages/ContactPage';
import CancellationPolicy from './components/pages/CancellationPolicy';
import Opinion from './components/pages/Opinion';

initializeIcons();

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

function MainLayout() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/login' && <Navbar />}
      <main> 
        <Routes>
          <Route path="/" element={<LandingView />} />
          <Route path="/home" element={<HomeView />} />
          <Route path="/offers" element={<OffersView />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user" element={<User />} />
          <Route path="/reserve" element={<ReservationPage />} />
          <Route path="/payment-status" element={<PaymentStatus />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/map" element={<HowToArrive />} />
          <Route path="/nuestra-historia" element={<NuestraHistoria />} />
          <Route path="/help" element={<Contacto />} />
          <Route path="/cancellation" element={<CancellationPolicy />} />
          <Route path="/reviews" element={<Opinion />} />

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