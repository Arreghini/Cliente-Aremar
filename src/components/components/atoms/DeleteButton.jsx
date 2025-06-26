import React from 'react';
import reservationService from '../../services/ReservationService';
import { useAuth0 } from "@auth0/auth0-react";
import { FaTrash } from 'react-icons/fa';

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
    <button onClick={() => handleDelete(reservationId)} className="text-red-500">
        <FaTrash />
    </button>
);
};

export default DeleteButton;
