import React from 'react';
import reservationService from '../../services/ReservationService';
import { useAuth0 } from "@auth0/auth0-react";

const DeleteButton = ({ reservationId, onDelete }) => {
  const { getAccessTokenSilently } = useAuth0();

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      try {
        const token = await getAccessTokenSilently();
        await reservationService.deleteReservation(token, reservationId);
        onDelete(reservationId);
      } catch (error) {
        console.error('Error al eliminar la reserva:', error);
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Eliminar
    </button>
  );
};

export default DeleteButton;
