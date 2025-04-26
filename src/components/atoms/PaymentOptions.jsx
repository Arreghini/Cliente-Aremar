import React, { useState, useEffect } from 'react';
import DepositPayReservation from './DepositPayReservation';
import RemainingPayReservation from './RemainingPayReservation';
import TotalPayReservation from './TotalPayReservation';

const PaymentOptions = ({ reservation }) => {
  const [paymentStatus, setPaymentStatus] = useState(reservation.paymentStatus);

  useEffect(() => {
    if (reservation.paymentStatus) {
      setPaymentStatus(reservation.paymentStatus);
    }
  }, [reservation.paymentStatus]);

  return (
    <div className="space-y-4">
      {paymentStatus === 'pending' && (
        <>
          <DepositPayReservation reservation={reservation} />
          <TotalPayReservation reservation={reservation} />
        </>
      )}
      {paymentStatus === 'deposit_paid' && (
        <RemainingPayReservation reservation={reservation} />
      )}
      {paymentStatus === 'fully_paid' && (
        <p className="text-green-600 font-semibold">Reserva pagada completamente ✅</p>
      )}
    </div>
  );
};

export default PaymentOptions;
