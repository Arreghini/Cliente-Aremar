import React, { useState } from 'react';
import semanaBaja from '../../assets/ofertas/semana-baja.webp';
import finSemanaLargo from '../../assets/ofertas/fin-semana-largo.jpg';
import voucher6dias from '../../assets/ofertas/voucher-6días.jpeg';
import homeofficeMar from '../../assets/ofertas/homeoffice-mar.webp';

const allOffers = [
  {
    title: 'Semana de baja demanda',
    description:
      'Aprovechá un 20% de descuento en semanas tranquilas para descansar frente al mar.',
    image: semanaBaja,
    badge: 'Descuento',
    category: 'semana',
  },
  {
    title: 'Fin de semana largo',
    description:
      'Reservá tu escapada con precios especiales para fines de semana XL.',
    image: finSemanaLargo,
    badge: 'Escapada',
    category: 'finde',
  },
  {
    title: 'Voucher por larga estadía',
    description:
      'Reservando más de 10 días, ¡ganás 1 día adicional para tu próxima estadía totalmente gratis!',
    image: voucher6dias,
    badge: 'Beneficio',
    category: 'voucher',
  },
  {
    title: 'Mes de HomeOffice con vista al mar',
    description:
      'Viví un mes inolvidable trabajando frente al mar con descuento exclusivo.',
    image: homeofficeMar,
    badge: 'Trabajo + Playa',
    category: 'homeoffice',
  },
];

const categories = [
  { key: 'all', label: 'Todas' },
  { key: 'semana', label: 'Semana tranquila' },
  { key: 'finde', label: 'Fin de semana largo' },
  { key: 'voucher', label: 'Voucher / +6 días' },
  { key: 'homeoffice', label: 'HomeOffice' },
];

const OffersPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredOffers =
    selectedCategory === 'all'
      ? allOffers
      : allOffers.filter((offer) => offer.category === selectedCategory);

  return (
    <div className="bg-mar-espuma min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 pt-16 text-center">
        <h1 className="text-4xl font-heading text-mar-profundo mb-4">
          Ofertas Especiales
        </h1>
        <p className="text-base font-body text-neutral-oscuro py-4">
          Descubrí promociones exclusivas para disfrutar frente al mar
        </p>
      </div>

      {/* Filtro */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-sm font-body border transition ${
              selectedCategory === cat.key
                ? 'bg-playa-sol text-neutral-oscuro border-playa-sol'
                : 'border-mar-profundo text-mar-profundo hover:bg-mar-claro hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid de ofertas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredOffers.map((offer, index) => (
          <div
            key={index}
            className="bg-neutral-claro shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={offer.image}
              alt={offer.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <span className="inline-block bg-playa-sol text-neutral-oscuro text-xs font-semibold px-2 py-1 rounded-full mb-2">
                {offer.badge}
              </span>
              <h2 className="font-heading text-lg text-mar-profundo mb-2">
                {offer.title}
              </h2>
              <p className="text-sm font-body text-neutral-oscuro">
                {offer.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersPage;
