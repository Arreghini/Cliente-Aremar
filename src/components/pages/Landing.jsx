import React, { useState, useEffect } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import logo from '../../assets/logos/delfines.gif';
import edificio from '../../assets/images/EdificioVista2.png';
import fishAnimation from '../../assets/images/pezAnimado.gif';
import imageAmanecer from '../../assets/images/LasToninasAmanecer.jpg';
import googlePlay from '../../assets/logos/google-play-badge.png';
import microsoftStoreBadge from '../../assets/logos/microsoft-store-badge.png';
import appStoreBadge from '../../assets/logos/app-store-badge.svg';

const Landing = ({
  logo: logoProp = logo,
  edificio: edificioProp = edificio,
  fishAnimation: fishAnimationProp = fishAnimation,
  imageAmanecer: imageAmanecerProp = imageAmanecer,
  googlePlay: googlePlayProp = googlePlay,
  microsoftStore: microsoftStoreProp = microsoftStoreBadge,
  appStore: appStoreProp = appStoreBadge,
  googlePlayUrl = "https://play.google.com/store/apps/details?id=tu.app.id",
  microsoftStoreUrl = "https://www.microsoft.com/store/apps/tu-app-id",
  appStoreUrl = "https://apps.apple.com/app/id-tu-app-id",
  title = "Las Toninas",
  subtitle = "Una puerta a la naturaleza",
  slogan = "Confort y naturaleza al mejor precio",
  modalText = "¡Descargá la app para acceder a reservas y novedades exclusivas!",
  sectionTitle = "¡Descargá nuestra App!",
  sectionText = "Reservá tu alojamiento, recibí notificaciones y accedé a promociones desde tu celular."
}) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const closeModal = () => {
    setIsModalOpen(false);
    localStorage.setItem('showModal', 'true');
  };

  useEffect(() => {
    const modalShown = localStorage.getItem('showModal');
    if (!modalShown || modalShown === 'false') {
      setIsModalOpen(true);
    }
  }, []);

  return (
    <div className="mt-16">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="relative bg-white w-full max-w-4xl h-[90vh] mx-4 p-4 rounded-lg overflow-hidden">
            <button
              className="absolute top-0 right-0 m-4 z-20 text-blue-200 text-3xl"
              onClick={closeModal}
            >
              <IoMdCloseCircle />
            </button>

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

              {/* Logos y botones en la parte inferior */}
              <div className="absolute bottom-4 left-0 w-full flex items-end justify-between px-4 z-30">
                {/* Logo edificio a la izquierda */}
                <img 
                  src={edificioProp}
                  alt="Edificio Toninas"
                  className="w-20 h-20 object-contain"
                />

                {/* Botones centrados */}
                <div className="flex gap-4">
                  <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer">
                    <div className="p-[2px] rounded-lg bg-white hover:bg-yellow-400 transition-colors">
                      <img
                        src={googlePlayProp}
                        alt="Google Play"
                        className="h-8 rounded-lg"
                      />
                    </div>
                  </a>
                  <a href={appStoreUrl} target="_blank" rel="noopener noreferrer">
                    <div className="p-[2px] rounded-lg bg-white hover:bg-yellow-400 transition-colors">
                      <img
                        src={appStoreProp}
                        alt="App Store"
                        className="h-8 rounded-lg"
                      />      
                    </div>   
                  </a>
                  <a href={microsoftStoreUrl} target="_blank" rel="noopener noreferrer">
                    <div className="p-[2px] rounded-lg bg-white hover:bg-yellow-400 transition-colors">
                      <img 
                        src={microsoftStoreProp} 
                        alt="Microsoft Store" 
                        className="h-8 rounded-lg"
                      />
                    </div>
                  </a>
                </div>

                {/* Logo a la derecha */}
                <img 
                  src={logoProp}
                  alt="Logo"
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="bg-gradient-to-r from-blue-200 to-blue-100 py-12 px-6 text-center mt-10">
        <h2 className="text-4xl font-bold text-blue-900 mb-4">{sectionTitle}</h2>
        <p className="text-blue-800 text-lg mb-6">{sectionText}</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer">
            <div className="p-[2px] rounded-lg bg-white hover:bg-yellow-400 transition-colors">
              <img src={googlePlayProp} alt="Google Play" className="h-14 rounded-lg" />
            </div>
          </a>
          <a href={appStoreUrl} target="_blank" rel="noopener noreferrer">
            <div className="p-[2px] rounded-lg bg-white hover:bg-yellow-400 transition-colors">
              <img src={appStoreProp} alt="App Store" className="h-14 rounded-lg" />
            </div>
          </a>
          <a href={microsoftStoreUrl} target="_blank" rel="noopener noreferrer">
            <div className="p-[2px] rounded-lg bg-white hover:bg-yellow-400 transition-colors">
              <img src={microsoftStoreProp} alt="Microsoft Store" className="h-14 rounded-lg" />
            </div>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Landing;
