import React from 'react';
import PayButton from './PayButton';

const RemainingPayReservation = ({ reservation }) => {
  // Calcula el saldo restante basado en el monto pagado
  const saldo = reservation.totalPrice - (reservation.amountPaid || 0);

  // Si el saldo es 0, no se muestra el botón de pago
  if (saldo <= 0) {
    return null;
  }

  return (
    <div className="border p-4 rounded-md shadow mt-4">
      <p className="mb-2 font-semibold">
        Saldo restante a pagar: <span className="text-green-600">${saldo.toFixed(2)}</span>
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