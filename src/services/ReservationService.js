import axios from 'axios';

const API_URL = 'http://localhost:3000/api/reservations'; 

// Configuración general de Axios para incluir token automáticamente
const createAxiosInstance = (token) => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

// Manejo de errores
const handleError = (error, action) => {
  const message = error.response?.data?.message || error.message || 'Error desconocido';
  throw new Error(`Error al ${action}: ${message}`);
};

// Métodos del servicio
const getReservation = async (token, reservationId) => {
  try {
    // Convertimos y validamos el ID
    const id = String(reservationId).trim();
    
    if (!id) {
      throw new Error('Se requiere un ID de reserva válido');
    }

    const api = createAxiosInstance(token);
    const response = await api.get(`/${id}`);

    // Verificamos que la respuesta contenga datos
    if (!response.data) {
      throw new Error('No se encontró la reserva solicitada');
    }

    return response.data;
    
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Reserva no encontrada');
    }
    handleError(error, 'obtener la reserva');
  }
};

const createReservation = async (token, reservationData) => {
  // Validación del token
  if (!token) {
    throw new Error('Token no disponible');
  }

  const axiosClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const formattedData = {
    roomTypeId: reservationData.roomType,
    checkIn: reservationData.checkInDate,
    checkOut: reservationData.checkOutDate,
    guestsNumber: parseInt(reservationData.numberOfGuests),
    userId: reservationData.userId // Agregamos el ID del usuario
  };

};

const confirmPayment = async (token, reservationId, paymentData) => {
  try {
    const api = createAxiosInstance(token);
    const response = await api.post(`/${reservationId}/payment`, paymentData);
    return response.data;
  } catch (error) {
    handleError(error, 'confirmar el pago');
  }
};

const updateReservation = async (token, reservationId, reservationData) => {
  try {
    if (!reservationId) throw new Error('ID de reserva requerido');
    const api = createAxiosInstance(token);
    const response = await api.patch(`/${reservationId}`, reservationData);
    return response.data;
  } catch (error) {
    handleError(error, 'actualizar la reserva');
  }
};

const deleteReservation = async (token, reservationId) => {
  try {
    if (!reservationId) throw new Error('ID de reserva requerido');
    const api = createAxiosInstance(token);
    const response = await api.delete(`/${reservationId}`);
    return response.data;
  } catch (error) {
    handleError(error, 'eliminar la reserva');
  }
};

// Exportar el servicio
const reservationService = {
  getReservation,
  createReservation,
  confirmPayment,
  updateReservation,
  deleteReservation,
};

export default reservationService;
