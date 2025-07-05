import React from 'react';

const HowToArrive = () => {
  return (
    <div className="pt-24 px-4 min-h-screen bg-neutral-oscuro">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-heading text-mar-profundo mb-4">Cómo llegar</h1>
        <p className="text-neutral-oscuro mb-6 font-body">
          Nuestra ubicación exacta está marcada en el mapa. Te esperamos en nuestras instalaciones frente al mar.
        </p>

        <div className="w-full h-[400px] rounded-xl overflow-hidden border border-mar-claro">
           <iframe
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
