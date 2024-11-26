import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import reservationService from '../../services/ReservationService';
import EditButton from '../atoms/EditButton';
import DeleteButton from '../atoms/DeleteButton';

const MisReservas = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [reservations, setReservations] = useState([]);
  const [showReservations, setShowReservations] = useState(false);

  const fetchUserReservations = async () => {
    if (!user?.sub) return;
    try {
      const token = await getAccessTokenSilently();
      const data = await reservationService.getUserReservations(token, user.sub);
      console.log('Datos recibidos:', data);
      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log('Error fetching reservations:', error);
      setReservations([]);
    }
  };

  const toggleReservations = async () => {
    if (!showReservations) {
      // Si las reservas no se están mostrando, las cargamos.
      await fetchUserReservations();
    }
    setShowReservations(!showReservations);
  };

  return (
    <div className="container mx-auto p-4">
      <button 
        onClick={toggleReservations} 
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {showReservations ? "Ocultar Reservas" : "Mis Reservas"}
      </button>

      {showReservations && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-4">Mis Reservas</h2>
          <ul>
            {reservations.map((reservation) => (
              <li 
                key={reservation.id} 
                className="border p-4 rounded shadow mb-2"
              >
                {reservation.roomType} - {reservation.checkInDate} - {reservation.checkOutDate}
                <div className="flex gap-2 mt-2">
                  <DeleteButton reservationId={reservation.id} />
                  <EditButton reservationId={reservation.id} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MisReservas;
