import React from 'react';
import PayButton from './PayButton';

const DepositPayReservation = ({ reservation }) => {
  const deposit = reservation.totalPrice ? reservation.totalPrice * 0.3 : 0;

  return (
    <div className="border p-4 rounded-md shadow">
      <p className="mb-2 font-semibold">
        Pagá la seña para confirmar tu reserva: <span className="text-blue-600">${deposit.toFixed(2)}</span>
      </p>
      <PayButton
        reservationId={reservation.id}
        price={deposit}
        containerId={`wallet-container-${reservation.id}`}
      />
    </div>
  );
};

export default DepositPayReservation;