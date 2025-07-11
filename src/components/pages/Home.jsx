import React, { useEffect, useState, useRef } from 'react';
import SearchBar from '../organisms/SearchBar';
import { videos } from '../../config/videos';
import GalleryEdificio from '../organisms/GalleryEdificio';
import SitiosInteres from '../organisms/SitiosInteres';
import RoomBasic from '../organisms/RoomBasic';
import { LuBedDouble } from 'react-icons/lu';
import { HiOutlineMapPin, HiOutlineBuildingOffice } from 'react-icons/hi2';
import Footer from '../organisms/Footer';

const Home = () => {

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
  const edificioRef = useRef(null);
  const sitiosRef = useRef(null);

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
          <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-black/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-mar-espuma opacity-50" />
        </div>

        <main className="relative z-10 flex flex-col items-center justify-center flex-grow px-4 text-center">
          <h1 className="font-title text-5xl font-bold text-mar-profundo drop-shadow-lg mb-6">
            Bienvenidos a <span className="text-playa-sol">Edificio Aremar</span>
          </h1>
          <p className="font-sans text-4xl font-bold text-playa-arena max-w-xl mb-10 drop-shadow-md">
            {`Descubrí, Disfrutá, Volvé`}
          </p> 

          {/* Botones de navegación */}
          <div className="w-full max-w-[90%] flex justify-start gap-4 mb-4 flex-wrap">
            <div
              onClick={() => habitacionesRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="group w-36 h-10 flex items-center justify-center bg-white gap-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <LuBedDouble className="text-black text-xl group-hover:text-black transition-colors duration-300" />
              <span className="font-serif text-black text-xs group-hover:text-black transition-colors duration-300">
                Deptos
              </span>
            </div>

            <div
              onClick={() => edificioRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="group w-36 h-10 flex items-center justify-center bg-white gap-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <HiOutlineBuildingOffice className="text-black text-xl group-hover:text-black transition-colors duration-300" />
              <span className="font-heading text-black text-xs group-hover:text-black transition-colors duration-300">
                Vistas del Edificio
              </span>
            </div>

            <div
              onClick={() => sitiosRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="group w-36 h-10 flex items-center justify-center bg-white gap-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <HiOutlineMapPin className="text-black text-xl group-hover:text-black transition-colors duration-300" />
              <span className="font-heading text-black text-xs group-hover:text-black transition-colors duration-300">
                Sitios de Interés
              </span>
            </div>
          </div>

          {/* SearchBar (fuera del grupo de botones) */}
          <div className="w-full max-w-[90%] bg-neutral-claro bg-opacity-80 rounded-xl shadow-lg p-1">
            <SearchBar />
          </div>
        </main>
      </div>

      {/* Sección "Visite nuestros deptos" */}
      <section ref={habitacionesRef} className="bg-neutral-claro py-16 scroll-mt-24">
        <h2 className="font-heading text-3xl text-mar-profundo text-center">Visite nuestros deptos</h2>
        <p className="font-body text-neutral-oscuro text-center mt-2 max-w-xl mx-auto">
          Elegí entre nuestras opciones de departamentos para disfrutar una estadía cómoda, moderna y frente al mar.
        </p>
        <RoomBasic />
      </section>

      {/* Sección de Visita al Edificio */}
      <section ref={edificioRef} className="bg-neutral-claro py-16">
        <h2 className="font-heading text-3xl text-mar-profundo text-center">Recorré el Edificio</h2>
        <p className="font-body text-neutral-oscuro text-center mt-2">
          Conocé todas nuestras instalaciones para que tu estadía sea única.
        </p>
        <div className="mt-8">
          <GalleryEdificio />
        </div>
      </section>

      {/* Sección de Sitios de Interés */}
      <section ref={sitiosRef} className="bg-neutral-claro py-16">
        <h2 className="font-heading text-3xl text-mar-profundo text-center">Sitios de Interés</h2>
        <p className="font-body text-neutral-oscuro text-center mt-2">
          Descubrí qué visitar en la zona para vivir al máximo tu experiencia.
        </p>
        <div className="mt-8">
          <SitiosInteres />
        </div>
      </section>

      {/* Footer */}
      <div className="h-16 bg-neutral-claro" />
      <Footer />
    </div>
  );
};

export default Home;
