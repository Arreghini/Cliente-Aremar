import React from 'react';
import DepositPayReservation from './DepositPayReservation';
import TotalPayReservation from './TotalPayReservation'; // Asegúrate de importar este componente

const PaymentOptions = ({ reservation }) => {
  return (
    <div>
      {reservation.status === "pending" && (
        <>
          <h3 className="text-lg font-semibold mb-4">Opciones de Pago</h3>
          {/* Opción para pagar la seña */}
          <DepositPayReservation reservation={reservation} />
          {/* Opción para pagar el total */}
          <TotalPayReservation reservation={reservation} />
        </>
      )}
    </div>
  );
};

export default PaymentOptions;