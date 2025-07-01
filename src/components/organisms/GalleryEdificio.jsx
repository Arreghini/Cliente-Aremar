
import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import NextArrow from '../atoms/NextArrow';
import PrevArrow from '../atoms/PrevArrow';

// Importar imágenes
import habitacion from '../../assets/images/habitacion.jpg';
import parque from '../../assets/images/parque.jpg';
import estacionamiento from '../../assets/images/estacionamiento.jpg';
import asensores from '../../assets/images/asensores.jpg';
import vistaEdificio1 from '../../assets/images/vistaEdificio1.jpeg';
import parrillasArea from '../../assets/images/parrillasArea.png';

const images = [
  { src: habitacion, alt: 'Habitación' },
  { src: parque, alt: 'Parque' },
  { src: estacionamiento, alt: 'Estacionamiento' },
  { src: asensores, alt: 'Ascensores' },
  { src: vistaEdificio1, alt: 'Vista del Edificio' },
  { src: parrillasArea, alt: 'Área de Parrillas' },
];

const GalleryEdificio = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 relative">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="p-2 w-full">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-48 object-cover rounded-xl cursor-pointer hover:scale-105 transition"
              onClick={() => setSelectedImage(image)}
            />
            <p className="text-center font-body mt-2">{image.alt}</p>
          </div>
        ))}
      </Slider>

      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-0 right-0 m-4 text-white text-3xl font-bold hover:text-red-500 transition"
              aria-label="Cerrar imagen ampliada"
            >
              ×
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-h-screen rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryEdificio;
