import axios from 'axios';

const API_URL = 'http://localhost:3000/api/reservations'; // Cambia la URL según tu configuración

const createReservation = async (reservationData) => {
  const response = await axios.post(API_URL, reservationData);
  return response.data;
};

const deleteReservation = async (reservationId) => {
  const response = await axios.delete(`${API_URL}/${reservationId}`);
  return response.data;
};

export default {
  createReservation,
  deleteReservation,
};
