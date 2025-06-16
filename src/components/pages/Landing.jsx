import React, { useState, useEffect } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import logo from '../../assets/logos/delfines.gif';
import edificio from '../../assets/images/EdificioVista2.png';
import fishAnimation from '../../assets/images/pezAnimado.gif';
import imageAmanecer from '../../assets/images/LasToninasAmanecer.jpg';

const Landing = ({
  logo: logoProp = logo,
  edificio: edificioProp = edificio,
  fishAnimation: fishAnimationProp = fishAnimation,
  imageAmanecer: imageAmanecerProp = imageAmanecer,
  title = "Las Toninas",
  subtitle = "Una puerta a la naturaleza"
}) => {
 const handleRedirect = () => {
  window.location.href = "http://localhost:5173/home";
};

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="relative bg-white w-full max-w-4xl h-[90vh] mx-4 p-4 rounded-lg overflow-hidden">
        {/* Botón de cierre */}
        <button
          className="absolute top-0 right-0 m-4 z-20 text-blue-200 text-3xl"
          onClick={handleRedirect}
        >
          <IoMdCloseCircle />
        </button>

        <div className="relative w-full h-full">
          {/* Imagen de fondo */}
          <img 
            src={imageAmanecerProp}
            alt="Atardecer en la playa"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Título y subtítulo */}
          <div className="absolute top-0 left-0 w-full bg-black bg-opacity-50 text-yellow-400 p-2 text-center z-10">
            <p className="text-6xl font-pacifico">{title}</p>
          </div>

          <div className="absolute top-20 left-0 w-full text-yellow-400 p-2 text-center z-10">
            <p className="text-3xl font-playwrite">{subtitle}</p>
          </div>

          {/* Pez animado */}
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20">
            <img 
              src={fishAnimationProp}
              alt="Pescado animado"
              className="w-20 h-20 mb-14 animate-fish"
            />
          </div>

          {/* Logos y botón */}
          <div className="absolute bottom-4 left-0 w-full flex items-end justify-between px-4 z-30">
            <img 
              src={edificioProp}
              alt="Edificio Toninas"
              className="w-20 h-20 object-contain"
            />

            <button
              onClick={handleRedirect}
              className="bg-black text-yellow-300 font-bold py-2 px-4 font-playwrite rounded-lg shadow-lg transition-all border-2 border-white hover:border-yellow-400"
            >
              Visitame
            </button>

            <img 
              src={logoProp}
              alt="Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
