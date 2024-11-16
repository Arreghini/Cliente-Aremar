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

const createReservation = async (reservationData) => {
  const { numberOfGuests, checkInDate, checkOutDate, roomType } = reservationData;

  const isAvailable = await roomService.checkAvailability(
    numberOfGuests,
    checkInDate,
    checkOutDate,
    roomType
  );

  if (!isAvailable) {
    throw new Error('Las fechas seleccionadas no están disponibles');
  }

  try {
    const response = await axios.post(API_URL, reservationData);
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
