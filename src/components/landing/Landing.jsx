import React, { useState, useEffect } from 'react';
import { IoMdCloseCircle } from "react-icons/io";

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
      console.log('Modal abierta');
    } else {
      console.log('Modal ya mostrada anteriormente');
    }
  }, []);

  return (
    <div className="mt-16">
      {isModalOpen && (

        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center">
          <div className="relative bg-white max-w-3xl w-full mx-4 p-4 rounded-lg">
          <div className="absolute top-0 right-0 m-4">
              <button
               className="text-font" onClick={closeModal} 
              >
                <IoMdCloseCircle className="text-3xl" />
              </button>
            </div>
            <div className="flex flex-col items-center">
              <iframe 
                src="https://do-sol-departamentos-de-mar-apartment.hoteles-costa-atlantica-de-argentina.com/data/Images/OriginalPhoto/9474/947486/947486407/image-las-toninas-do-sol-departamentos-de-mar-apartment-6.JPEG" 
                title="Atardecer en la playa" 
                className="w-full border-none rounded-lg"
                style={{ height: "80vh", width: "80vh" }}
              ></iframe>
              <p className="mt-4 text-center">
                Texto adicional dentro del modal.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;
