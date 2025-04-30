import React, { useEffect, useState } from 'react';
import PayButton from './PayButton';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const DepositPayReservation = ({ reservation }) => {
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchPrice = async () => {
      if (!reservation?.id) return;

      try {
        const token = await getAccessTokenSilently();

        const response = await axios.post(
          `http://localhost:3000/api/reservations/${reservation.id}/payment`,
          {
            reservationId: reservation.id,
            paymentType: 'deposit',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedPrice = response?.data?.price;
        if (typeof fetchedPrice === 'number' && !isNaN(fetchedPrice)) {
          setPrice(fetchedPrice);
        } else {
          throw new Error('Precio inválido recibido');
        }
      } catch (err) {
        console.error('Error al obtener el precio:', err);
        setError('No se pudo obtener el precio de la seña');
      }
    };

    fetchPrice();
  }, [reservation?.id, getAccessTokenSilently]);

  if (!reservation?.id) return null;
  if (error) return <p className="text-red-500">{error}</p>;
  if (typeof price !== 'number') return <p>Cargando precio...</p>;
  if (price <= 0) return null;

  return (
    <div className="border p-4 rounded-md shadow">
      <p className="mb-2 font-semibold">
        Pagá la seña para confirmar tu reserva:{' '}
        <span className="text-blue-600">${Number(price).toFixed(2)}</span>
      </p>
      <PayButton
        reservationId={reservation.id}
        price={price}
        containerId={`wallet-container-${reservation.id}`}
        paymentType="deposit"
      />
    </div>
  );
};

export default DepositPayReservation;
