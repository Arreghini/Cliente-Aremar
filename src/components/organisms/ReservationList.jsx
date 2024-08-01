import React, { useEffect, useState } from 'react';
import reservationService from '../services/reservationService';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);

  const fetchReservations = async () => {
    try {
      const data = await reservationService.getReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleDelete = async (reservationId) => {
    try {
      await reservationService.deleteReservation(reservationId);
      fetchReservations();
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <ul>
      {reservations.map(reservation => (
        <li key={reservation.id}>
          {reservation.roomId} - {reservation.checkInDate} to {reservation.checkOutDate}
          <button onClick={() => handleDelete(reservation.id)}>Cancel</button>
        </li>
      ))}
    </ul>
  );
};

export default ReservationList;
