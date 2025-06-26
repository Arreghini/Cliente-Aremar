import React from 'react';
import DepositPayReservation from './DepositPayReservation';
import TotalPayReservation from './TotalPayReservation';
import RemainingPayReservation from './RemainingPayReservation';

const PaymentOptions = ({ reservation }) => {
  const remainingAmount = reservation.totalPrice - (reservation.amountPaid || 0);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Opciones de Pago</h3>
      {reservation.status === "pending" && (
        <>
          <DepositPayReservation reservation={reservation} />
          <TotalPayReservation reservation={reservation} />
        </>
      )}
      {reservation.status === "confirmed" && remainingAmount > 0 && (
        <RemainingPayReservation reservation={reservation} />
      )}
    </div>
  );
};

export default PaymentOptions;