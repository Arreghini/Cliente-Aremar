import React from 'react';

const HowToArrive = () => {
  return (
    <div className="pt-36 bg-neutral-oscuro min-h-screen flex">
      <div className="px-6 py-10 max-w-4xl mx-auto bg-neutral-claro text-neutral-800 dark:text-neutral-100 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-mar-profundo dark:text-mar-espuma mb-6">
          Cómo llegar
        </h1>

        <p className="mb-6">
          Nuestra ubicación exacta está marcada en el mapa. Te esperamos en
          nuestras instalaciones frente al mar.
        </p>

        <div className="w-full h-[400px] rounded-xl overflow-hidden border border-mar-claro shadow-md">
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d1275.8127849009443!2d-56.69309912645954!3d-36.49908847006253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1scalle%2042%20y%201%20las%20toninas!5e1!3m2!1ses-419!2sar!4v1751414727738!5m2!1ses-419!2sar"
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default HowToArrive;
