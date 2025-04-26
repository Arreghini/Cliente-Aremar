import React from 'react';
import PayButton from './PayButton';

const RemainingPayReservation = ({ reservation }) => {
  const saldo = reservation.totalAmount - reservation.depositAmount;

  return (
    <div className="border p-4 rounded-md shadow mt-4">
      <p className="mb-2 font-semibold">
        Saldo restante a pagar al ingresar: <span className="text-green-600">${saldo}</span>
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
