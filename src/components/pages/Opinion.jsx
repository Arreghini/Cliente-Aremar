import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const reviews = [
  {
    name: 'María G.',
    comment:
      '¡Una experiencia maravillosa! Las habitaciones son cómodas y el servicio es excepcional. Definitivamente volveré.',
    picture: null,
  },
  {
    name: 'Juan P.',
    comment:
      'El lugar es hermoso, con vistas increíbles al mar. Ideal para unas vacaciones relajantes.',
    picture: null,
  },
];

const Opinion = () => {
  const { user, isAuthenticated } = useAuth0();

  // Si el usuario está logueado, agregamos su reseña con su imagen de perfil
  const userReview = isAuthenticated
    ? {
        name: user.name || user.nickname || 'Usuario',
        comment: '¡Me encantó mi experiencia en Aremar! Todo impecable.',
        picture: user.picture,
      }
    : null;

  const allReviews = userReview ? [userReview, ...reviews] : reviews;

  return (
    <div className="pt-36 bg-neutral-oscuro min-h-screen flex">
      <div className="px-6 py-10 max-w-4xl mx-auto bg-neutral-claro text-neutral-800 dark:text-neutral-100 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-mar-profundo dark:text-mar-espuma mb-6">
          Opiniones de Nuestros Clientes
        </h1>
        <p className="mb-6">
          En Aremar, valoramos la opinión de nuestros huéspedes. Aquí
          compartimos algunas de las reseñas más destacadas que hemos recibido.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Reseñas Recientes</h2>
        <div className="space-y-6">
          {allReviews.map((review, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 bg-white/70 rounded-lg p-4 shadow"
            >
              <img
                src={
                  review.picture ||
                  `https://i.pravatar.cc/150?u=${review.name.replaceAll(' ', '')}`
                }
                alt={review.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-mar-profundo"
              />
              <div>
                <p className="font-semibold text-mar-profundo">{review.name}</p>
                <p className="text-neutral-700">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Opinion;
