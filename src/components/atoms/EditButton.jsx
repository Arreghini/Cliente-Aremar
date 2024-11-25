import React from 'react';
import reservationService from '../../services/ReservationService';
import { useAuth0 } from "@auth0/auth0-react";

const EditButton = ({ reservationId, onEdit }) => {
  const { getAccessTokenSilently } = useAuth0();

  const handleEdit = async () => {
    try {
      const token = await getAccessTokenSilently();
      const reservationData = await reservationService.getReservation(token, reservationId);
      onEdit(reservationData);
    } catch (error) {
      console.error('Error al obtener la reserva:', error);
    }
  };

  return (
    <button 
      onClick={handleEdit}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Editar
    </button>
  );
};

export default EditButton;
