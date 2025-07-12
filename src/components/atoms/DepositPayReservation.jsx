import React, { useEffect, useState } from 'react';
import PayButton from './PayButton';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import PropTypes from 'prop-types';

const DepositPayReservation = ({ reservation }) => {
  const [price, setPrice] = useState(null);
  const [title, setTitle] = useState('');
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchPrice = async () => {
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

        setPrice(response.data.price);
        setTitle(response.data.title);
      } catch (error) {
        console.error('Error al obtener el precio de la seña:', error);
      }
    };

    fetchPrice();
  }, [reservation.id, getAccessTokenSilently]);

  if (price === null) return <p>Cargando...</p>;
  if (price <= 0) return null;

  return (
    <div className="border p-4 rounded-md shadow">
      <p className="mb-2 font-semibold">
        Pagá la seña para confirmar tu reserva:{' '}
        <span className="text-blue-600">${price}</span>
      </p>
      <PayButton
        reservationId={reservation.id}
        price={price}
        title={title}
        containerId={`wallet-container-${reservation.id}`}
        paymentType="deposit"
      />
    </div>
  );
};
DepositPayReservation.propTypes = {
  reservation: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default DepositPayReservation;
