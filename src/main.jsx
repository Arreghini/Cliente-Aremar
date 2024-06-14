import React from 'react';
import { createRoot } from "react-dom/client"; // Importa createRoot en lugar de ReactDOM
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css"

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

