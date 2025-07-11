import React from 'react';
import PayButton from './PayButton';
import PropTypes from 'prop-types';

const TotalPayReservation = ({ reservation }) => {
  return (
    <div className="border p-4 rounded-md shadow">
      <p className="mb-2 font-semibold">
        Pagá el total de tu reserva ahora: <span className="text-red-600">${reservation.totalPrice}</span>
      </p>
      <PayButton
        reservationId={reservation.id}
        price={reservation.totalPrice}
        containerId={`total-pay-${reservation.id}`}
        paymentType="total" // <-- nuevo
      />

    </div>
  );
};
TotalPayReservation.propTypes = {
  reservation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    totalPrice: PropTypes.number.isRequired,
  }).isRequired,
};

export default TotalPayReservation;
