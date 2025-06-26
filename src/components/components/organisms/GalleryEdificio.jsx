// src/components/organisms/GalleryEdificio.jsx
import React, { useState } from 'react';
import Slider from 'react-slick';
// Importar los archivos locales
import habitacion from '../../assets/images/habitacion.jpg';
import parque from '../../assets/images/parque.jpg';
import estacionamiento from '../../assets/images/estacionamiento.jpg';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const images = [
  { src: habitacion, alt: 'Habitación' },
  { src: parque, alt: 'Parque' },
  { src: estacionamiento, alt: 'Estacionamiento' },
];

const GalleryEdificio = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <Slider {...settings}>
        {images.map((place, index) => (
          <div key={index} className="p-2">
            <img
            src={place.src}
            alt={place.alt}
            className="w-full h-48 object-cover rounded-xl cursor-pointer hover:scale-105 transition"
          />

          </div>
        ))}
      </Slider>

      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            className="max-h-screen rounded-xl"
          />
        </div>
      )}
    </div>
  );
};

export default GalleryEdificio;
