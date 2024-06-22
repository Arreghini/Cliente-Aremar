import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import DetailView from "./views/DetailView";
import HomeView from "./views/HomeView";
import LandingView from "./views/LandingView";
import Navbar from "./components/navbar/Navbar";
import Login from "./components/login/Login";
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { Auth0Provider } from '@auth0/auth0-react'

initializeIcons();

function MainLayout() {

  const location = useLocation()
  const isLoginActive = location.pathname === '/login'
  const showNavbar = location.pathname !== "/login" 
  
  return (
    <>

    {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomeView />} />
        <Route path="/detail/:id" element={<DetailView />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    authorizationParams={{
    redirect_uri: window.location.origin
    }}
    >
      <MainLayout />
    </Auth0Provider>
        );
}

export default App;
