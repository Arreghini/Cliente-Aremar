import axios from 'axios';
import roomService from './RoomService';

const API_URL = 'http://localhost:3000/api/reservations'; 

const handleError = (error, action) => {
  const message = error.response?.data?.message || error.message || 'Error desconocido';
  throw new Error(`Error al ${action}: ${message}`);
};

const getReservation = async (reservationId) => {
  try {
    const response = await axios.get(`${API_URL}/${reservationId}`);
    return response.data;
  } catch (error) {
    handleError(error, 'obtener la reserva');
  }
};
const createReservation = async (token, reservationData) => {
  const { numberOfGuests, checkInDate, checkOutDate, roomType } = reservationData;

  // Convertimos explícitamente a número y validamos
  const guestsNumber = parseInt(numberOfGuests, 10);
  
  if (!guestsNumber || guestsNumber < 1 || guestsNumber > 4) {
    throw new Error('El número de huéspedes debe estar entre 1 y 4');
  }

  if (!checkInDate || !checkOutDate || !roomType) {
    throw new Error('Datos de reserva incompletos');
  }

  try {
    const response = await axios.post(API_URL, {
      ...reservationData,
      numberOfGuests: guestsNumber
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error, 'crear la reserva');
  }
};

const updateReservation = async (reservationId, reservationData) => {
  try {
    if (!reservationId) throw new Error('ID de reserva requerido');
    const response = await axios.patch(`${API_URL}/${reservationId}`, reservationData);
    return response.data;
  } catch (error) {
    handleError(error, 'actualizar la reserva');
  }
};

const deleteReservation = async (reservationId) => {
  try {
    const response = await axios.delete(`${API_URL}/${reservationId}`);
    return response.data;
  } catch (error) {
    handleError(error, 'eliminar la reserva');
  }
};

const reservationService = {
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
};

export default reservationService;
