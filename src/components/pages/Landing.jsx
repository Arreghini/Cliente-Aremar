import React, { useState } from 'react';
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
  const [showModal, setShowModal] = useState(true);

  const handleClose = (e) => {
    e.stopPropagation(); // evita que se dispare la redirección
    setShowModal(false);
  };

  const handleRedirect = () => {
    window.location.href = "http://localhost:5173/home"; 
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      {/* Modal clickeable entera para redirigir */}
      <div
        onClick={handleRedirect}
        className="relative bg-gray-100 w-full max-w-4xl h-[90vh] mx-4 p-1 rounded-lg overflow-hidden cursor-pointer"
      >
        {/* Botón cerrar (evita redirección) */}
        <button
          className="absolute top-0 right-0 m-4 z-20 text-blue-200 text-3xl"
          onClick={handleClose}
        >
          <IoMdCloseCircle />
        </button>

        {/* Contenido visual de la landing */}
        <div className="relative w-full h-full">
          <img 
            src={imageAmanecerProp}
            alt="Atardecer en la playa"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute top-0 left-0 w-full bg-black bg-opacity-50 text-yellow-400 p-2 text-center z-10">
            <p className="text-6xl font-pacifico">{title}</p>
          </div>

          <div className="absolute top-20 left-0 w-full text-yellow-400 p-2 text-center z-10">
            <p className="text-3xl font-playwrite">{subtitle}</p>
          </div>

          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-20">
            <img 
              src={fishAnimationProp}
              alt="Pescado animado"
              className="w-20 h-20 mb-14 animate-fish"
            />
          </div>

          <div className="absolute bottom-4 left-0 w-full flex items-end justify-between px-4 z-30">
            <img 
              src={edificioProp}
              alt="Edificio Toninas"
              className="w-20 h-20 object-contain"
            />

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
