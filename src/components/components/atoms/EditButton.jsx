import React from 'react';
import reservationService from '../../services/ReservationService';
import { useAuth0 } from "@auth0/auth0-react";
import { FaEdit } from "react-icons/fa";

const EditButton = ({ reservationId, onEdit }) => {
  const { getAccessTokenSilently } = useAuth0();
 
  const handleEdit = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log('ID de reserva a editar:', reservationId);
      const reservationData = await reservationService.getReservation(token, parseInt(reservationId));
      onEdit(reservationData);
    } catch (error) {
      console.error('Error al obtener la reserva:', error);
    }
  };
  
  return (
    <button 
      onClick={handleEdit} 
      className="text-blue-500 hover:text-blue-700"
    >
      <FaEdit />
    </button>
  );
};

export default EditButton;
