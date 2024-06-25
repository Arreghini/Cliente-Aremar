import React, { useState, useEffect } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import ImageAmanecer from '../../assets/LasToninasAmanecer.jpg';
import Logo from '../../assets/fish-animation.gif';
import Edificio from '../../assets/EdificioVista2.png';
import FishAnimation from '../../assets/pezAnimado.gif';

const Landing = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
    localStorage.setItem('showModal', 'true');
    console.log('Modal cerrada y estado guardado en localStorage');
  };

  useEffect(() => {
    console.log('useEffect llamada');
    const modalShown = localStorage.getItem('showModal');
    if (!modalShown || modalShown === 'false') {
      setIsModalOpen(true);
      document.body.style.overflow = 'hidden';
    }
  }, []);

  return (
    <div className="mt-16">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="relative bg-white w-full max-w-4xl h-3/4 mx-4 p-4 rounded-lg overflow-hidden">
            <button
              className="absolute top-0 right-0 m-4 z-20 text-blue-200 text-3xl"
              onClick={closeModal}
            >
              <IoMdCloseCircle />
            </button>
            <div className="relative w-full h-full">
              <div className="absolute top-0 left-0 w-full bg-black bg-opacity-50 text-yellow-400 p-2 text-center z-10">
                <p className="text-6xl font-pacifico">Las Toninas</p>
              </div>
              <div className="absolute top-16 left-0 w-full text-yellow-400 p-2 text-center z-10">
                <p className="text-3xl font-playwrite">Una puerta a la naturaleza</p>
              </div>
              <img 
                src={ImageAmanecer} 
                alt="Atardecer en la playa" 
                className="absolute inset-0 w-full h-full object-cover" 
              />
              <div className="absolute bottom-16 left-0 w-full text-center z-20">
                <p className='text-2xl font-playwrite text-yellow-500'>Confort y naturaleza al mejor precio</p>
              </div>
              <div className="absolute bottom-1/5 top-1/2 left-1/2 transform -translate-x-1/2 z-20 text-center">
              <img 
              src={FishAnimation} 
              alt="Pescado animado" 
              className="w-20 h-20 animate-fish" 
              />
              </div>
              <div>
                <img 
                  src={Edificio} 
                  alt="Edificio Toninas" 
                  className="absolute bottom-4 left-4 w-20 h-20 object-contain z-20" 
                />
              </div>
              <img 
                src={Logo} 
                alt="Logo" 
                className="absolute bottom-4 right-4 w-20 h-22 object-contain z-20" 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;
