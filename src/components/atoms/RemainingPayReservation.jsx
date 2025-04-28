import React from 'react';
import PayButton from './PayButton';

const RemainingPayReservation = ({ reservation }) => {
  // Calcula el depósito como un porcentaje fijo (30% del precio total)
  const deposit = reservation.totalPrice ? reservation.totalPrice * 0.3 : 0;
  const saldo = reservation.totalPrice - deposit;

  return (
    <div className="border p-4 rounded-md shadow mt-4">
      <p className="mb-2 font-semibold">
        Saldo restante a pagar al ingresar: <span className="text-green-600">${saldo.toFixed(2)}</span>
      </p>
      <PayButton
        reservationId={reservation.id}
        price={saldo}
        containerId={`remaining-pay-${reservation.id}`}
      />
    </div>
  );
};

export default RemainingPayReservation;
