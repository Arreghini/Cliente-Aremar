import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import DetailView from "./views/DetailView";
import HomeView from "./views/HomeView";
import LandingView from "./views/LandingView";
import NavBar from "./components/navbar/Navbar";

function MainLayout() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingView />} />
        <Route path="/home" element={<HomeView />} />
        <Route path="/detail/:id" element={<DetailView />} />
      </Routes>
    </Router>
  );
}

function App() {
  return <MainLayout />;
}

export default App;


 