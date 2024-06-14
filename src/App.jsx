import React from "react";
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import DetailView from "./views/DetailView";
import HomeView from "./views/HomeView";
import LandingView from "./views/LandingView";
import Navbar from "./components/navbar/Navbar";

function MainLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingView />} />
        <Route path="/home" element={<HomeView />} />
        <Route path="/detail/:id" element={<DetailView />} />
      </Routes>
    </>
  );
}

function App() {
  return (
      <MainLayout />
        );
}

export default App;
