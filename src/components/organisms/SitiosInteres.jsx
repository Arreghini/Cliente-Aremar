import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import NextArrow from '../atoms/NextArrow';
import PrevArrow from '../atoms/PrevArrow';
import playa from '../../assets/images/playaAmanecer.jpg';
import barcos from '../../assets/images/barcosPesca.jpg';
import escollera from '../../assets/images/escollera.jpg';
import banana from '../../assets/images/banana.jpg';
import laberinto from '../../assets/images/laberinto.jpg';
import pesca from '../../assets/images/pesca.jpg';

const places = [
  { src: playa, alt: 'Playa ', link: '#' },
  { src: barcos, alt: 'Barcos de pesca', link: '#' },
  { src: escollera, alt: 'Escollera', link: '#' },
  { src: banana, alt: 'Banana', link: '#' },
  { src: laberinto, alt: 'Laberinto', link: '#' },
  { src: pesca, alt: 'Pesca', link: '#' },
];

const SitiosInteres = () => {
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

  console.log('SitiosInteres se está montando');

  return (
    <div className="max-w-6xl mx-auto px-4 relative h-56">
      <Slider {...settings}>
        {places.map((place, index) => (
          <div key={index} className="p-2 w-full">
            <a href={place.link}>
              <img
                src={place.src}
                alt={place.alt}
                className="w-full h-48 object-cover rounded-xl cursor-pointer hover:scale-105 transition"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedImage(place);
                }}
              />
            </a>
            <p className="text-center font-body mt-2">{place.alt}</p>
          </div>
        ))}
      </Slider>

      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={() => setSelectedImage(null)}
        >
          {/* Contenedor para evitar que el click en la imagen cierre el modal */}
          <div
            className="relative max-w-4xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cierre */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-0 right-0 m-4 text-white text-3xl font-bold hover:text-red-500 transition"
              aria-label="Cerrar imagen ampliada"
            >
              ×
            </button>

            {/* Imagen ampliada */}
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

export default SitiosInteres;
