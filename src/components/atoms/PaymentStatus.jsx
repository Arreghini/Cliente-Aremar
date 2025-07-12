import React from 'react';
import { useLocation } from 'react-router-dom';

const PaymentStatus = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const status = queryParams.get('status');
  const reservationId = queryParams.get('reservationId');

  console.log('Parámetros recibidos en el frontend:', {
    status,
    reservationId,
  });

  if (!status || !reservationId) {
    return <p>Parámetros inválidos</p>;
  }

  return (
    <div>
      {status === 'approved' && (
        <h1 className="text-green-700 text-3xl font-sans">
          Reserva Confirmada
        </h1>
      )}
      {status === 'failure' && (
        <h1 className="text-red-500">El pago ha fallado</h1>
      )}
      {status === 'pending' && (
        <h1 className="text-yellow-500">El pago está pendiente</h1>
      )}
    </div>
  );
};
export default PaymentStatus;
