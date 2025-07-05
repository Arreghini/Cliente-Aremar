import React, { useEffect, useState, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../organisms/SearchBar';
import { videos } from '../../config/videos';
import GalleryEdificio from '../organisms/GalleryEdificio';
import SitiosInteres from '../organisms/SitiosInteres';
import { HiOutlineBuildingOffice } from 'react-icons/hi2';
import RoomBasic from '../organisms/RoomBasic';

const Home = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();
          const response = await axios.post(
            'http://localhost:3000/api/users/sync',
            user,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.data.data.isAdmin) {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      }
    };
    checkAdminStatus();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  const videoList = [
    videos.marTranquilo,
    videos.ranaAlSol,
    videos.marRoca1,
    videos.barcoYMar,
    videos.barquito,
    videos.ciudadCostera,
    videos.gaviotas,
    videos.libro,
    videos.marOrilla,
    videos.jovenFrenteMar,
    videos.niñosSkate,
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [videoList.length]);

const habitacionesRef = useRef(null);

  return (
    <div className="relative flex flex-col">
      {/* Sección de Video y Búsqueda */}
      <div className="relative h-screen flex flex-col">
        <div className="absolute inset-0 z-0">
          <video
            src={videoList[currentVideoIndex]}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-mar-espuma opacity-50"></div>
        </div>

        <main className="relative z-10 flex flex-col items-center justify-center flex-grow px-4 text-center">
  <h1 className="font-heading text-5xl text-mar-profundo drop-shadow-lg mb-6">
    Bienvenidos a <span className="text-playa-sol">Edificio Aremar</span>
  </h1>
  <p className="font-body text-neutral-oscuro max-w-xl mb-10 drop-shadow-md">
    Disfrutá de las mejores vacaciones junto al mar con nuestras exclusivas habitaciones y servicios.
  </p>

  {/* Logo Deptos arriba de la SearchBar */}
  <div className="w-full max-w-[90%] flex justify-start mb-2">
 <div
  onClick={() => {
    habitacionesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }}
  className="group flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105"
>
  <HiOutlineBuildingOffice className="text-white text-xl group-hover:text-playa-sol transition-colors duration-300" />
  <span className="font-heading text-white text-lg group-hover:text-playa-sol transition-colors duration-300">
    Deptos
  </span>
</div>

  </div>

  {/* SearchBar */}
  <div className="w-full max-w-[90%] bg-neutral-claro bg-opacity-80 rounded-xl shadow-lg p-1">
    <SearchBar />
  </div>
</main>
      </div>
{/* Sección "Visite nuestros deptos" */}
<section
  ref={habitacionesRef}
  className="bg-neutral-claro py-16 scroll-mt-24"
>
  <h2 className="font-heading text-3xl text-mar-profundo text-center">
    Visite nuestros deptos
  </h2>
  <p className="font-body text-neutral-oscuro text-center mt-2 max-w-xl mx-auto">
    Elegí entre nuestras opciones de departamentos para disfrutar una estadía cómoda, moderna y frente al mar.
  </p>
  <RoomBasic />
</section>

      {/* Sección de Visita al Edificio */}
      <section className="bg-neutral-claro py-16">
        <h2 className="font-heading text-3xl text-mar-profundo text-center">Recorré el Edificio</h2>
        <p className="font-body text-neutral-oscuro text-center mt-2">
          Conocé todas nuestras instalaciones para que tu estadía sea única.
        </p>
        <div className="mt-8">
          <GalleryEdificio /> 
        </div>
      </section>

      {/* Sección de Sitios de Interés */}
      <section className="bg-neutral-claro py-16">
        <h2 className="font-heading text-3xl text-mar-profundo text-center">Sitios de Interés</h2>
        <p className="font-body text-neutral-oscuro text-center mt-2">
          Descubrí qué visitar cerca de nuestro edificio para vivir al máximo tu experiencia.
        </p>
        <div className="mt-8">
          <SitiosInteres />          
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center p-4 font-body text-neutral-oscuro bg-neutral-claro bg-opacity-70">
        © 2025 Edificio Aremar. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Home;
