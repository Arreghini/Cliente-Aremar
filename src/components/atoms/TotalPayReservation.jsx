import React from 'react';
import PayButton from './PayButton';

const TotalPayReservation = ({ reservation }) => {
  return (
    <div className="border p-4 rounded-md shadow">
      <p className="mb-2 font-semibold">
        Pagá el total de tu reserva ahora: <span className="text-red-600">${reservation.totalPrice}</span>
      </p>
      <PayButton
        reservationId={reservation.id}
        price={reservation.totalAmount}
        containerId={`total-pay-${reservation.id}`}
      />
    </div>
  );
};

export default TotalPayReservation;
