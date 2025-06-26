// src/components/organisms/SitiosInteres.jsx
import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import playa from '../../assets/images/playaAmanecer.jpg';
import barcos from '../../assets/images/barcosPesca.jpg';    
import escollera from '../../assets/images/escollera.jpg';

const places = [
  { src: playa, alt: 'Playa Aremar', link: '#' },
  { src: barcos, alt: 'Faro Costero', link: '#' },
  { src: escollera, alt: 'Muelle de Pesca', link: '#' },
];

const SitiosInteres = () => {
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
       {places.map((place, index) => (
  <div key={index} className="p-2 max-w-xs w-full">
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50" onClick={() => setSelectedImage(null)}>
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

export default SitiosInteres;
